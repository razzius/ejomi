import json
import os
import random

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


@app.route('/')
def index():
    return render_template('index.html')


def emoji_string(n):
    # TODO ensure distinct emoji
    return ''.join(random_emoji()[0] for _ in range(n))


def handle_message(ws, data):
    if data['type'] == 'join':
        username = data['username']
        clients[ws] = username

        notify_all({
            'type': 'join',
            'username': username
        })
    elif data['type'] == 'start':
        s = emoji_string(10)

        print(f'Starting game with string {s} and {len(clients)} clients')

        notify_all({
            'type': 'start',
            'emoji': s
        })

        # TODO keep track of this user being messenger
        print(f'Clients: {clients}')

        messenger_user = random.choice(list(clients.keys()))

        notify_user(messenger_user, {
            'type': 'messenger',
            'goal': random.choice(s)
        })
    else:
        raise Exception('Unknown event {}'.format(data))


def notify_all(data):
    redis.publish(REDIS_CHAN, json.dumps(data))


def notify_user(ws, data):
    # janky
    data['_user_id'] = id(ws)
    redis.publish(REDIS_CHAN, json.dumps(data))


@sockets.route('/socket')
def handle_websocket(ws):
    clients[ws] = {'username': None}

    message = {
        'type': 'welcome',
        '_user_id': id(ws)
    }

    notify_user(ws, message)

    while not ws.closed:
        message = ws.receive()
        if message is None:
            print('Got none message')
            del clients[ws]
        else:
            data = json.loads(message)

            handle_message(ws, data)

        gevent.sleep(.1)
