import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';

import Clock from './Clock.react';

class Voter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedEmojiIndex: 0,
    };

  }

  _onEmojiClick = (emojiIndex) => {
    this.setState({
      selectedEmojiIndex: emojiIndex,
    });
  }

  render() {
    return (
      <div>
        <p>
          {"Scrambled Message: " + this.props.scrambledMessage}
        </p>
        <EmojiBoard
          emojiList={this.props.emojiList}
          onEmojiClick={this._onEmojiClick}
          goalEmojiIndex={this.state.selectedEmojiIndex}
        />
        <button
          onClick={() => this.props.onSubmit(this.state.selectedEmojiIndex)}>
          Submit Vote
        </button>
        <Clock timerSeconds={this.props.timerSeconds} />
      </div>
    );
  }
}

export default Voter;
