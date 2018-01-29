import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';
import RevealingMessage from './RevealingMessage.react';
import Clock from './Clock.react';

class Revealer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <EmojiBoard
          goalEmojiIndex={this.props.goalEmojiIndex}
          emojiList={this.props.emojiList}
          votes={this.props.votes}
          users={this.props.users}
           />
      <RevealingMessage state="original" originalMessage={this.props.originalMessage} scrambledMessage={this.props.scrambledMessage}/>
      <p> The messenger was {this.props.users[this.props.messenger_id].username}. </p>
      <p> And the scrambler was {this.props.users[this.props.scrambler_id].username}! </p>
      <Clock timerSeconds={this.props.timerSeconds} />

    </div>

    );
  }
}

export default Revealer;
