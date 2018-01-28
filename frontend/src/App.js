import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Messenger from './Messenger.react';
import Voter from './components/Voter.react';

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
        <Messenger selectedEmojiIndex={this.state.selectedEmojiIndex} lolwut={"hello"} />
        <Voter />
      </div>
    );
  }
}

export default App;
