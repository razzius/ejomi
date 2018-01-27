import React, { Component } from 'react';
import './App.css';
import Messenger from './Messenger.react';
import Scrambler from './components/Scrambler.react';
import Voter from './components/Voter.react';

const PAGES = {
  MESSENGER: 'MESSENGER',
  SCRAMBLER: 'SCRAMBLER',
  VOTER: 'VOTER',
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: PAGES.MESSENGER,
      selectedEmojiIndex: 5,
    };
  }

  render() {
    const {
      currentPage,
      selectedEmojiIndex,
    } = this.state;

    let pageComponent = null;
    if (currentPage === PAGES.MESSENGER) {
      pageComponent = <Messenger selectedEmojiIndex={this.state.selectedEmojiIndex} timerSeconds={30} />;
    } else if (currentPage === PAGES.SCRAMBLER) {
      pageComponent = <Scrambler />; // TODO
    } else if (currentPage === PAGES.VOTER) {
      pageComponent = <Voter />; // TODO
    }

    return (
      <div className="App">
        <p>
          Current Page: {currentPage}
        </p>
        {pageComponent}
      </div>
    );
  }
}

export default App;
