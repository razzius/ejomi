import React, { Component } from 'react';
import Clock from './Clock.react';
import EmojiBoard from './EmojiBoard.react';
import TextInput from './TextInput.react';
import SkipButton from './SkipButton.react'

// props: message
class Scrambler extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.message,
    };
  }

  render() {
    const message = this.props.message;
    return (
      <div>
        <EmojiBoard
          emojiList={this.props.emojiList}
          counterIndex={0} />
        {
          !this.props.isSpectator &&
          <div>
            <p>Original message: {message}</p>
            <p>Your scramble:</p>
            <TextInput onSubmit={this.props.onSubmit} referenceString={message} />
          </div>
        }
        <Clock timerSeconds={this.props.timerSeconds} />
        <SkipButton onSubmitSkip={this.props.onSubmitSkip}/>
      </div>
    );
  }
}

export default Scrambler;
