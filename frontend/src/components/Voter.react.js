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
    const {
      allowedToVote,
      emojiList,
      onSubmit,
      scrambledMessage,
      timerSeconds,
    } = this.props;

    return (
      <div>
        <p>
          {"Scrambled Message: " + scrambledMessage}
        </p>
        <EmojiBoard
          emojiList={emojiList}
          onEmojiClick={allowedToVote && this._onEmojiClick}
          goalEmojiIndex={allowedToVote && this.state.selectedEmojiIndex}
        />
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
