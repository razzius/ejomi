import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';
import RevealingMessage from './RevealingMessage.react';
import Clock from './Clock.react';

class Revealer extends Component {

  constructor(props) {
    super(props);

    if(this.props.users[this.props.messenger_id])
      this.messenger_name = this.props.users[this.props.messenger_id].username;
    else
      this.messenger_name = null

    if(this.props.users[this.props.scrambler_id])
      this.scrambler_name = this.props.users[this.props.scrambler_id].username;
    else
      this.scrambler_name = null

    this.messenger_text = this.messenger_name ? "The messenger was " + this.messenger_name : "The messenger is no longer in the game."
    this.scrambler_text = this.scrambler_name ? "And the scrambler was " + this.scrambler_name + "!" : "The scrambler is no longer in the game."
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
      <p> {this.messenger_text} </p>
      <p> {this.scrambler_text} </p>
      <Clock timerSeconds={this.props.timerSeconds} />

    </div>

    );
  }
}

export default Revealer;
