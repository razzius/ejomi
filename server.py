import json
import os
import random
import classes.GameInstance
import classes.Guess
import classes.Player

import gevent
import redis
from flask import Flask, render_template
from flask_sockets import Sockets

from random_emoji import random_emoji

REDIS_URL = os.environ.get('REDIS_URL', 'localhost:6371')
REDIS_CHAN = 'emoji'

app = Flask(__name__)
app.debug = 'DEBUG' in os.environ

sockets = Sockets(app)
redis = redis.from_url(REDIS_URL)

current_round = 0
clients = {}

pubsub = redis.pubsub()
pubsub.subscribe(REDIS_CHAN)


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

                gevent.spawn(send, user, json.dumps(data).encode())
            else:
                for client in clients.keys():
                    gevent.spawn(send, client, message['data'])

        else:
            print(f'Redis gave informative message {message}')


gevent.spawn(publish_redis_messages_to_clients)

def get_scrambler_index(client):
    return (clients[client]['index'] + 1 ) % len(clients)

def get_scrambler(client):
    index = get_scrambler_index(client)
    return next(user for user in users if clients[user]['index'] == index)

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


def start_game_timer():
    gevent.sleep(10)

    for client in clients:
        send_hint_to_scrambler(client)

    gevent.sleep(10)

    for client in clients:
        send_hint_to_everybody(client)

        gevent.sleep(30)

        round += 1
        # round is over, calculate scores
        update_scores()


@app.route('/')
def index():
    return render_template('index.html')


def emoji_string(n):
    # TODO ensure distinct emoji
    return ''.join(random_emoji()[0] for _ in range(n))

def emoji_list(n):
    # TODO ensure distinct emoji
    return [random_emoji()[0] for _ in range(n)]

def handle_message(client, data):
    if data['type'] == 'join':

        username = data['username']
        clients[client]['username'] = username

        notify_all({
            'type': 'update_users',
            'users': [client['username'] for client in clients.values()]
        })
    elif data['type'] == 'start':
        s = emoji_list(10)

        print(f'Starting game with string {s} and {len(clients)} clients')

        notify_all({
            'type': 'start',
            'emoji': s,
        })

        # TODO keep track of this user being messenger
        print(f'Clients: {clients}')

        # messenger_user = random.choice(list(clients.keys()))

        # Generate a list of randomly shuffled users
        client_list = list(clients)
        random.shuffle(client_list)

        for index,client in enumerate(client_list):
            goal = random.randint(0, 10)
            notify_user(client, {
                'type': 'messenger',
                'goal': goal
            })
            clients[client]['goal'] = goal
            clients[client]['index'] = index

        gevent.spawn(start_game_timer)


    # The clue that the hinter suggests
    elif data['type'] == 'hint':
        hint = data['hint']
        print(f'Received hint:{hint} from {clients[client]["username"]}')

        hint = validate(hint)
        clients[client]['hint'] = hint

    # The scrambled hint
    elif data['type'] == 'scrambled_hint':
        scrambled_hint = data['scrambled_hint']
        print(f'Received scrambled_hint:{scrambled_hint} from {clients[client]["username"]}')

        scrambled_hint = validate_scrambled(scrambled_hint, clients[client]['unscrambled_hint'])
        clients[client]['scrambled_hint'] = scrambled_hint

    elif data['type'] == 'guess':
        guess = data['guess']
        clients[client]['guess'][round_number] = guess

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
    data['_user_id'] = id(client)
    redis.publish(REDIS_CHAN, json.dumps(data))

def get_bootstrap_state():
    return {
        'users': [client['username'] for client in clients.values()],
    }

@sockets.route('/socket')
def handle_websocket(client):
    clients[client] = {
        'username': None,
        'guess': {}
    }

    message = {
        'type': 'welcome',
        'bootstrap_state': get_bootstrap_state(),
        '_user_id': id(client)
    }

    notify_user(client, message)

    while not client.closed:
        message = client.receive()
        if message is None:
            print('Got none message')
            del clients[client]
        else:
            data = json.loads(message)

            handle_message(client, data)

        gevent.sleep(.1)
