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
<<<<<<< HEAD
=======
    const {
      currentPage,
      selectedEmojiIndex,
    } = this.state;

    let pageComponent = null;
    if (currentPage === PAGES.MESSENGER) {
      pageComponent = <Messenger selectedEmojiIndex={this.state.selectedEmojiIndex} timerSeconds={30} />;
    } else if (currentPage === PAGES.SCRAMBLER) {
      pageComponent = <Scrambler message={'flagfllagg'}/>;
    } else if (currentPage === PAGES.VOTER) {
      pageComponent = <Voter />;
    }

>>>>>>> 6072ccd492ea8c33cb3783b28e99c82b3acc1546
    return (
      <div className="App">
        <Messenger selectedEmojiIndex={this.state.selectedEmojiIndex} lolwut={"hello"} />
        <Voter />
      </div>
    );
  }
}

export default App;
