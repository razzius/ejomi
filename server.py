from enum import Enum
import json
import os
import random
from Models import GameInstance, Player

import gevent
import redis

from flask import Flask, send_from_directory
from flask_sockets import Sockets

from random_emoji import random_emoji



REDIS_URL = os.environ.get('REDIS_URL', 'localhost:6371')
REDIS_CHAN = 'emoji'

app = Flask(
    __name__,
    static_url_path='/static',
    static_folder='frontend/build/static'
)

app.debug = 'DEBUG' in os.environ

sockets = Sockets(app)
redis = redis.from_url(REDIS_URL)

# Game Stages
class Stages(Enum):
    LOBBY = 'LOBBY'
    MESSENGER = 'MESSENGER'
    SCRAMBLER = 'SCRAMBLER'
    VOTER = 'VOTER'

# Global State
clients = {}
game_instances = {}
players = {}
current_stage = Stages.LOBBY
current_vote = 0

pubsub = redis.pubsub()
pubsub.subscribe(REDIS_CHAN)

def gen_random_id():
    return id(object())

def send(client, raw_data):
    try:
        client.send(raw_data)
    except Exception:
        app.logger.exception('Failed to send to client, removing from pool')
        del clients[client]


def publish_redis_messages_to_clients():
    for message in pubsub.listen():
        print(f'publish message {message}')

        if message['type'] == 'message':
            data = json.loads(message['data'])

            if '_user_id' in data:
                print(f'Sending to {data["_user_id"]}')
                # race condition: user disconnects
                user = [user for user in clients.keys() if id(user) == data['_user_id']][0]
                print(f'publishing to {id(user)} only')

                gevent.spawn(send, user, json.dumps(data).encode())
            else:
                print(f'publishing to all {len(clients)} clients')
                for client in clients.keys():
                    gevent.spawn(send, client, message['data'])

        else:
            print(f'Redis gave informative message {message}')


gevent.spawn(publish_redis_messages_to_clients)

def get_scrambler_index(client):
    return (clients[client]['index'] + 1 ) % len(clients)

def get_scrambler(client):
    index = get_scrambler_index(client)
    return next(user for (user, client) in clients.items() if client['index'] == index)

def send_hint_to_scrambler(client):
    scrambler = get_scrambler(client)

    clients[scrambler]['unscrambled_hint'] = client['hint']

    notify_user(scrambler, {
        'type': 'unscrambled_hint',
        'unscrambled_hint': client['hint'],
    })

def send_hint_to_everybody(client):
    scrambler = get_scrambler(client)
    notify_all({
        'type': 'scrambled_hint',
        'scrambled_hint': clients[scrambler]['scrambled_hint']
    })


def update_scores():
    pass

def reset_game():
    global clients, game_instances, players, current_stage, current_vote
    clients = {}
    game_instances = {}
    players = {}
    current_stage = Stages.LOBBY
    current_vote = 0
    broadcast_state()


def start_game_timer():
    global current_stage, current_vote
    current_stage = Stages.MESSENGER
    broadcast_state()

    gevent.sleep(10)

    current_stage = Stages.SCRAMBLER
    broadcast_state()

    gevent.sleep(10)

    current_stage = Stages.VOTER
    current_vote = next(game_id for game_id in game_instances)
    broadcast_state()

    gevent.sleep(10)
    reset_game()

    # for client in clients:
    #     send_hint_to_everybody(client)
    #
    #     gevent.sleep(30)
    #
    #     round += 1
    #     # round is over, calculate scores
    #     update_scores()


@app.route('/')
def index():
    return send_from_directory('frontend/build/', 'index.html')


def make_emoji_list(n):
    # ensure distinct emoji
    emojis = set()
    while len(emojis) < n:
        emojis.add(random_emoji()[0])
    return list(emojis)

def broadcast_state():
    notify_all({
        'current_stage': current_stage.name,
        'current_vote': current_vote,
        'type': 'state_update',
        'games': {k: v.to_dict() for (k, v) in game_instances.items()},
        'users': {client_id: player.to_dict() for (client_id, player) in players.items()}
    })

def get_client_id(client):
    return clients[client]['id']

def handle_message(client, data):
    client_id = get_client_id(client)
    print(f'handle_message({client_id}, {data})')

    if data['type'] == 'join':
        player = Player(client, data['username'])
        players[client_id] = player
        broadcast_state()

    elif data['type'] == 'start':
        if len(players) < 3:
            raise Exception("Not enough players")

        player_ids = list(players.keys())
        derangement = list(player_ids)
        while any(x == y for (x, y) in zip(player_ids, derangement)):
            random.shuffle(derangement)

        for ((messenger_id, player), scrambler_id) in zip(players.items(), derangement):
            emojis = make_emoji_list(10)
            game_instance = GameInstance(emojis, messenger_id, scrambler_id)
            game_instances[id(game_instance)] = game_instance

            print(f'Starting game {game_instance.to_dict()}')

        broadcast_state()

        gevent.spawn(start_game_timer)


    # The clue that the hinter suggests
    elif data['type'] == 'hint':
        hint = validate(data['hint'])
        print(f'Received hint:{hint} from {client_id}')

        game = next(game for game in game_instances.values() if game.messenger_id == client_id)
        game.message = hint

    # The scrambled hint
    elif data['type'] == 'scrambled_hint':
        scrambled_hint = data['scrambled_hint']
        print(f'Received scrambled_hint:{scrambled_hint} from {clients[client]["username"]}')

        game = next(game for game in game_instances.values() if game.scrambler_id == client_id)
        game.scrambled_message = scrambled_hint

    elif data['type'] == 'guess':
        guess = data['guess']
        print(f'Received guess:{guess} from {clients[client]["username"]}')



    else:
        raise Exception('Unknown event {}'.format(data))

# Takes in a hint and verifies the size limit
# Returns the first 10 chars of hint if over limit, otherwise original hint
def validate(hint):
    return hint[:10]

#TODO: Logic for verification
def validate_scrambled(scrambled_hint,hint):
    return hint[:10]

def notify_all(data):
    redis.publish(REDIS_CHAN, json.dumps(data))


def notify_user(client, data):
    # janky
    data['_user_id'] = get_client_id(client)
    redis.publish(REDIS_CHAN, json.dumps(data))

@sockets.route('/socket')
def handle_websocket(client):
    client_id = id(client)
    print(f'Got connection from {client_id}')

    clients[client] = {
        'id': client_id,
        'username': None,
        'guess': {}
    }

    message = {
        'type': 'welcome',
        '_user_id': client_id,
    }

    broadcast_state()

    notify_user(client, message)

    while not client.closed:
        message = client.receive()
        if message is None:
            print(f'Got none message, closing {client_id}')
            del clients[client]
        else:
            data = json.loads(message)

            handle_message(client, data)

        gevent.sleep(.1)
