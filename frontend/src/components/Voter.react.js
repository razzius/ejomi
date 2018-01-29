import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';
import RevealingMessage from './RevealingMessage.react';
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
    const {
      allowedToVote,
      emojiList,
      onSubmit,
      scrambledMessage,
      timerSeconds,
    } = this.props;

    return (
      <div>
        <EmojiBoard
          emojiList={emojiList}
          onEmojiClick={allowedToVote && this._onEmojiClick}
          goalEmojiIndex={allowedToVote && this.state.selectedEmojiIndex}
        />
        <RevealingMessage state="voter" originalMessage={this.props.scrambledMessage} scrambledMessage={this.props.scrambledMessage}/>
        {allowedToVote
          ? <button
              onClick={() => onSubmit(this.state.selectedEmojiIndex)}>
              Submit Vote
            </button>
          : <p>Waiting for other players to vote...</p>
        }
        <Clock timerSeconds={timerSeconds} />
      </div>

    );
  }
}

export default Voter;
