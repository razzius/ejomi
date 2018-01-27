import json
import os

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


def send(client, data):
    try:
        client.send(data['data'])
    except Exception:
        app.logger.exception('Failed to send to client, removing from pool')
        del clients[client]


def send_message_to_all_clients():
    for message in pubsub.listen():
        for client in clients.keys():
            gevent.spawn(send, client, message)


gevent.spawn(send_message_to_all_clients)


@app.route('/')
def index():
    return render_template('index.html')


def emoji_string(n):
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
        print(s)
        notify_all({
            'type': 'start',
            'emoji': s
        })
    else:
        raise Exception('Unknown event {}'.format(data))


def notify_all(data):
    redis.publish(REDIS_CHAN, json.dumps(data).encode())


@sockets.route('/socket')
def handle_websocket(ws):
    clients[ws] = {'username': None}

    while not ws.closed:
        message = ws.receive()
        if message is None:
            print('Got none message')
        else:
            data = json.loads(message)

            handle_message(ws, data)

        gevent.sleep(.1)
