from enum import Enum
import json
import os
import random

import gevent
import redis

from flask import Flask, send_from_directory
from flask_sockets import Sockets

from random_emoji import random_emoji

from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

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

FAST_TIMES = {
    'LOBBY': -1,
    'MESSENGER': 10,
    'SCRAMBLER': 10,
    'VOTER': 10,
    'REVEALER': 10,
}

NORMAL_TIMES = {
    'LOBBY': -1,
    'MESSENGER': 50,
    'SCRAMBLER': 90,
    'VOTER': 50,
    'REVEALER': 30,
}

TIMES = NORMAL_TIMES if 'FAST' not in os.environ else FAST_TIMES


# Game Stages
class Stages(Enum):
    LOBBY = 'LOBBY'
    MESSENGER = 'MESSENGER'
    SCRAMBLER = 'SCRAMBLER'
    VOTER = 'VOTER'
    REVEALER = 'REVEALER'


# Server State
clients = []
break_sleep = False

# do not mutate!
START_STATE = {
    'games': [],
    'players': {},
    'current_stage': Stages.LOBBY.name,
    'current_vote': 0
}

pubsub = redis.pubsub()
pubsub.subscribe(REDIS_CHAN)


# Accessors for state across servers which uses redis
def get_state():
    return json.loads(redis.get('state'))


def set_state(state):
    redis.set('state', json.dumps(state))


def get_next_stage(stage_name):
    if stage_name == Stages.LOBBY.name:
        return Stages.MESSENGER.name
    elif stage_name == Stages.MESSENGER.name:
        return Stages.SCRAMBLER.name
    elif stage_name == Stages.SCRAMBLER.name:
        return Stages.VOTER.name
    elif stage_name == Stages.VOTER.name:
        return Stages.REVEALER.name
    elif stage_name == Stages.REVEALER.name:
        return Stages.VOTER.name


def delete_client(client):
    client_id = str(id(client))
    print(f"deleting client {client_id}")

    state = get_state()

    if state['current_stage'] == Stages.LOBBY.name and client_id in state['players']:
        del state['players'][str(client_id)]

    if client in clients:
        clients.remove(client)

    set_state(state)
    broadcast_state()


def send(client, raw_data):
    try:
        client.send(raw_data)
    except Exception as e:
        app.logger.exception('Failed to send to client, removing from pool')
        delete_client(client)


def ping_clients():
    while True:
        for client in clients:
            notify_user(client, {'type': 'ping'})

        gevent.sleep(10)


def publish_redis_messages_to_clients():
    for message in pubsub.listen():
        app.logger.info(f'Pubsub: {message}')

        if message['type'] == 'message':
            data = json.loads(message['data'])

            if '_user_id' in data:
                print(f'Sending to {data["_user_id"]}')
                try:
                    user = next(user for user in clients if str(id(user)) == data['_user_id'])
                except StopIteration:
                    print(f'{data["_user_id"]} not on this server')
                    continue

                gevent.spawn(send, user, json.dumps(data).encode())
            else:
                print(f'publishing to all {len(clients)} clients')
                for client in clients:
                    gevent.spawn(send, client, message['data'])

        else:
            print(f'Redis gave informative message {message}')


def create_game(messenger_id, scrambler_id):
    n_emoji = 10

    goal_index = random.randint(0, n_emoji)

    return {
        'messenger_id': messenger_id,
        'scrambler_id': scrambler_id,
        'emoji_board': make_emoji_list(n_emoji),
        'goal_index': goal_index,
        # Creates an anti_goal that excludes the regular goal
        'anti_goal': random.choice([n for n in range(n_emoji) if n != goal_index]),
        'message': '',
        'scrambled_message': '',
        'votes': {}
    }

# determines if everyone's skip is True
def is_all_skip(players):
    for player in players.keys():
        print(f'player={player}')
        print(f'players[player]={players[player]}')
        print(f'players[player][skip]={players[player]["skip"]}')
        if players[player]['skip'] is False:
            return False
    return True

# sets all skip to 0 unless specified
def reset_skips(players, *ids_to_set_skip):
    for player in players:
        if player in ids_to_set_skip:
            players[player]['skip'] = True
        else:
            players[player]['skip'] = False
    return players

def stop_sleep():
    global break_sleep
    break_sleep = True

# unused
def send_hint_to_scrambler(client):
    """The client is the messenger for this round"""
    games = get_state()['games']

    game = next(game for game in games if game['messenger_id'] == str(id(client)))

    scrambler = next(user for user in clients if game['scrambler_id'] == str(id(user)))

    notify_user(scrambler, {
        'type': 'unscrambled_hint',
        'unscrambled_hint': game['message'],
    })


def reset_game():
    set_state(START_STATE)
    broadcast_state()


def start_game_timer():
    global break_sleep
    break_sleep = False
    state = get_state()
    # Stage = MESSENGER
    state['current_stage'] = get_next_stage(state['current_stage'])
    state['players'] = reset_skips(state['players'])

    set_state(state)
    broadcast_state()

    for i in range(TIMES[state['current_stage']]):
        if break_sleep:
            break
        gevent.sleep(1)

    break_sleep = False
    state = get_state()
    # Stage = SCRAMBELR
    state['current_stage'] = get_next_stage(state['current_stage'])
    state['players'] = reset_skips(state['players'])

    set_state(state)
    broadcast_state()

    for i in range(TIMES[state['current_stage']]):
        if break_sleep:
            break
        gevent.sleep(1)
    break_sleep = False

    state = get_state()

    games = state['games']

    for game_id in games:
        state = get_state()
        # Stage = VOTER
        state['current_stage'] = get_next_stage(state['current_stage'])
        # Initialize skip with messenger and scrambler true
        state['players'] = reset_skips(state['players'],game_id['messenger_id'],game_id['scrambler_id'])

        set_state(state)
        broadcast_state()

        for i in range(TIMES[state['current_stage']]):
            if break_sleep:
                break
            gevent.sleep(1)
        break_sleep = False

        state = get_state()
        # Stage = REVEALER
        state['current_stage'] = get_next_stage(state['current_stage'])
        state['players'] = reset_skips(state['players'])

        set_state(state)
        broadcast_state()

        for i in range(TIMES[state['current_stage']]):
            if break_sleep:
                break
            gevent.sleep(1)
        break_sleep = False

        state['current_vote'] = state['current_vote'] + 1

        set_state(state)

    reset_game()


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
    state = get_state()

    print(f'Client ids: {[id(client) for client in clients]}')

    games = state['games']
    players = state['players']
    current_stage = state['current_stage']
    current_vote = state['current_vote']

    notify_all({
        'current_stage': current_stage,
        'times': TIMES,
        'current_vote': current_vote,
        'type': 'state_update',
        'games': games,
        'users': players,
    })


def handle_message(client, data):
    global break_sleep
    client_id = str(id(client))
    print(f'handle_message from {client_id} with data {data}')

    if data['type'] == 'join':
        state = get_state()

        players = state['players']
        games = state['games']

        player = {
            'username': data['username'],
            'score': 0,
            'skip': False
        }

        players[client_id] = player

        set_state(state)
        broadcast_state()

    elif data['type'] == 'start':
        state = get_state()

        players = state['players']
        games = state['games']

        if len(players) < 3:
            raise Exception('Not enough players')

        player_ids = list(players.keys())
        derangement = list(player_ids)

        while any(x == y for x, y in zip(player_ids, derangement)):
            random.shuffle(derangement)

        for messenger_id, scrambler_id in zip(player_ids, derangement):
            game = create_game(messenger_id, scrambler_id)

            games.append(game)

            print(f'Starting game {game}')

        set_state(state)
        broadcast_state()

        gevent.spawn(start_game_timer)

    # The clue that the hinter suggests
    elif data['type'] == 'hint':
        state = get_state()

        players = state['players']
        games = state['games']

        hint = data['hint']

        game = next(
            game
            for game in games
            if game['messenger_id'] == client_id
        )

        game['message'] = hint

        # Set same hint as scrambled in case of disconnect
        game['scrambled_message'] = hint

        set_state(state)
        broadcast_state()

    # The scrambled hint
    elif data['type'] == 'scrambled_hint':
        state = get_state()
        games = state['games']
        scrambled_hint = data['scrambled_hint']

        game = next(game for game in games if game['scrambler_id'] == client_id)
        game['scrambled_message'] = scrambled_hint

        set_state(state)
        broadcast_state()

    elif data['type'] == 'vote':
        state = get_state()
        vote = data['vote']
        games = state['games']
        game = games[state['current_vote']]

        game['votes'][client_id] = vote

        set_state(state)
        broadcast_state()

    elif data['type'] == 'skip':
        state = get_state()
        players = state['players']
        players[client_id]['skip'] = True

        if (is_all_skip(players)):
            stop_sleep()

        set_state(state)
        broadcast_state()

    else:
        raise Exception('Unknown event {}'.format(data))


def notify_all(data):
    redis.publish(REDIS_CHAN, json.dumps(data))


def notify_user(client, data):
    # Uses _user_id as a hidden field to restrict only send to single user
    data['_user_id'] = str(id(client))
    redis.publish(REDIS_CHAN, json.dumps(data))


@sockets.route('/socket')
def handle_websocket(client):
    client_id = str(id(client))
    print(f'Got connection from {client_id}')

    clients.append(client)

    message = {
        'type': 'welcome',
        '_user_id': client_id,
    }

    try:
        broadcast_state()
    except Exception:
        app.logger.exception('Failed to broadcast state to new user')

    notify_user(client, message)

    while not client.closed:
        message = client.receive()
        if message is None:
            print(f'Got none message, closing {client_id}')
            delete_client(client)
        else:
            data = json.loads(message)

            try:
                handle_message(client, data)
            except Exception:
                app.logger.exception('Failed to handle user message')

        gevent.sleep(.1)


# Reset server state on server reload
if redis.get('state') is None:
    redis.set('state', json.dumps(START_STATE))

gevent.spawn(publish_redis_messages_to_clients)
gevent.spawn(ping_clients)
