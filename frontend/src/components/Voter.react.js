import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';

import Clock from './Clock.react';

class Voter extends Component {
  state = {
    selectedEmojiIndex: 0,
  };

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
          messageIndex={this.state.selectedEmojiIndex}
        />
        <Clock timerSeconds={this.props.timerSeconds} />
      </div>
    );
  }
}

export default Voter;
