import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Messenger from './Messenger.react';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedEmojiIndex: 5,
    };
  }

  render() {
    return (
      <div className="App">
        <Messenger selectedEmojiIndex={this.state.selectedEmojiIndex} timerSeconds={30} />
      </div>
    );
  }
}

export default App;
