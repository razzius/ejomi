import React, { Component } from 'react';
import ReconnectingWebsocket from 'reconnecting-websocket'

import './App.css';
import Lobby from './components/Lobby.react';
import Messenger from './components/Messenger.react';
import Scrambler from './components/Scrambler.react';
import Voter from './components/Voter.react';
import Revealer from './components/Revealer.react';
import MockState from './MockState';

const PAGES = {
  LOBBY: 'LOBBY',
  MESSENGER: 'MESSENGER',
  SCRAMBLER: 'SCRAMBLER',
  VOTER: 'VOTER',
  REVEALER: 'REVEALER'
};

const SHOULD_MOCK_STATE = false;

// print extra logging
const DEBUG_MODE = false;

const host = 'localhost:8000'

function getWsProtocol() {
  if (window.location.protocol === 'https:') {
    return 'wss://'
  } else {
    return 'ws://'
  }
}

function sendMessage(ws, message) {
  ws.send(JSON.stringify(message))
}

function handleMessage(message) {
  if (DEBUG_MODE) {
    console.log("onmessage", message);
  }
  const reader = new FileReader()

  reader.onload = () => {
    const data = JSON.parse(reader.result)

    console.log('Received', data);

    if (data.type === 'welcome') {
      this.setState({
        userId: data._user_id,
      });
    } else if (data.type === 'state_update') {
      this.setState({
        currentStage: data.current_stage,
        currentVote: data.current_vote,
        games: data.games,
        users: data.users,
      });
    } else if (data.type === 'messenger') {
      this.setState({
        goalEmojiIndex: data.goal,
      });
    }
  }

  reader.readAsText(message.data)
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentStage: PAGES.LOBBY,
      currentVote: 0,
      games: {},
      goalEmojiIndex: 5,
      userId: -1,
      users: {},
    };

    const protocol = getWsProtocol()

    const ws = new ReconnectingWebsocket(`${protocol}${host}/socket`);
    ws.onmessage = handleMessage.bind(this);
    if (DEBUG_MODE) {
      ws.onopen = (e) => {
        console.log("opened", e);
      }
      ws.onclose = (e) => {
        console.log("closed", e);
      }
      ws.debug = true;
    }

    this.ws = ws
  }

  // for convenience
  _sendMessage = (message) => {
    sendMessage(this.ws, message);
  }

  handleJoin(joinName) {
    console.log(joinName);
    sendMessage(this.ws, {type: 'join', username: joinName})
  }

  handleStart(event) {
    sendMessage(this.ws, {type: 'start'})
  }

  _onSubmitHint = (hint) => {
    this._sendMessage({
      hint: hint,
      type: 'hint',
    });
  }

  _onSubmitScrambledHint = (scrambled_hint) => {
    this._sendMessage({
      scrambled_hint: scrambled_hint,
      type: 'scrambled_hint',
    });
  }

  // override this to mock state
  _getState = () => {
    if (SHOULD_MOCK_STATE) {
      return MockState;
    } else {
      return this.state;
    }
  }

  _onSubmitVote = (vote) => {
    this._sendMessage({
      game_id: this._getState().currentVote,
      vote: vote,
      type: 'vote',
    });
  }

  _getGameByMessenger = (messenger_id) => {
    return Object.values(this._getState().games).find(game =>
      game.messenger_id === messenger_id
    );
  }

  _getGameByScrambler = (scrambler_id) => {
    return Object.values(this._getState().games).find(game =>
      game.scrambler_id === scrambler_id
    );
  }

  render() {
    const state = this._getState();
    console.log("State: ", state);
    const {
      currentStage,
      currentVote,
      games,
      userId,
      users,
    } = state;

    let pageComponent = null;
    if (currentStage === PAGES.LOBBY) {
      pageComponent =
        <div>
          <p>userId: {userId}</p>
          <Lobby
            userList = {Object.values(users).map(user => user.username)}
            onJoin = {this.handleJoin.bind(this)}
            onStart = {this.handleStart.bind(this)}
            showStart = {Object.keys(users).length > 2}
          />
        </div>;
    } else if (!(userId in users)) {
      pageComponent = <p>Game in progress. Please wait until the next round.</p>;
    } else if (currentStage === PAGES.MESSENGER) {
      const game = this._getGameByMessenger(userId);
      pageComponent =
        <Messenger
          emojiList={game.emoji_board}
          onSubmit={this._onSubmitHint}
          goalEmojiIndex={game.goal_index}
          timerSeconds={10}
          characterLimit={10}
        />;
    } else if (currentStage === PAGES.SCRAMBLER) {
      const game = this._getGameByScrambler(userId);
      pageComponent =
        <Scrambler
          emojiList={game.emoji_board}
          onSubmit={this._onSubmitScrambledHint}
          message={game.message}
          timerSeconds={10}
        />;
    } else if (currentStage === PAGES.VOTER) {
      const game = games[currentVote];
      pageComponent = (
        <Voter
          emojiList={game.emoji_board}
          onSubmit={this._onSubmitVote}
          scrambledMessage={game.scrambled_message}
          timerSeconds={10}
        />
      );
    } else if (currentStage === PAGES.REVEALER) {
      const game = games[currentVote];
      pageComponent = (
        <Revealer
          goalEmojiIndex={game.goal_index}
          emojiList={game.emoji_board}
          originalMessage={game.message}
          scrambledMessage={game.scrambled_message}
        />
      );
    }

    return (
      <div className="App">
        <h1>EJOMI</h1>
        <p>
          Current Stage: {currentStage}
        </p>
        {pageComponent}
      </div>
    );
  }
}

export default App;
