import React, { Component } from 'react';
import ReconnectingWebsocket from 'reconnecting-websocket'

import './App.css';
import Lobby from './components/Lobby.react';
import Messenger from './components/Messenger.react';
import Scrambler from './components/Scrambler.react';
import Voter from './components/Voter.react';

const PAGES = {
  LOBBY: 'LOBBY',
  MESSENGER: 'MESSENGER',
  SCRAMBLER: 'SCRAMBLER',
  VOTER: 'VOTER',
};

const DEFAULT_PAGE = PAGES.LOBBY;
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
      currentStage: DEFAULT_PAGE,
      emoji: ['😂','😄','😃','😀','😊','😉','😍','😘','😚','😗'],
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

  _getGameByMessenger = (messenger_id) => {
    return Object.values(this.state.games).find(game =>
      game.messenger_id === messenger_id
    );
  }

  render() {
    console.log("State: ", this.state);
    const {
      currentStage,
      emoji,
      userId,
      users,
    } = this.state;


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
    } else if (currentStage === PAGES.MESSENGER) {
      const game = this._getGameByMessenger(userId);
      console.log("found game", game);
      pageComponent =
        <Messenger
          emojiList={game.emoji_board}
          onSubmit={this._onSubmitHint}
          selectedEmojiIndex={game.goal_index}
          timerSeconds={30}
          characterLimit={10}
        />;
    } else if (currentStage === PAGES.SCRAMBLER) {
      pageComponent = <Scrambler message={'flagfllagg'}/>;
    } else if (currentStage === PAGES.VOTER) {
      pageComponent = (
        <Voter
          emojiList={emoji}
          timerSeconds={30}
          scrambledMessage={'wagwagfrog'}
        />
      );
    }

    return (
      <div className="App">
        <p>
          Current Stage: {currentStage}
        </p>
        {pageComponent}
      </div>
    );
  }
}

export default App;
