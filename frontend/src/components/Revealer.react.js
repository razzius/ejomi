import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';

class Revealer extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <EmojiBoard
          goalEmojiIndex={this.props.goalEmojiIndex}
          emojiList={this.props.emojiList}
          counterIndex={0} />
      <p> Original </p>
      <p> {this.props.originalMessage} </p>
      <p> Scrambled </p>
      <p> {this.props.scrambledMessage} </p>
    </div>
    );
  }
}

export default Revealer;
