import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';

import Clock from './Clock.react';
import Message from './Message.react';

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
        <Clock />
        <Message text={this.props.scrambledMessage}/>
      </div>

    );
  }
}

export default Voter;
