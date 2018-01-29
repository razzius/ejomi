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
    const onSubmit = this.props.onSubmit;
    onSubmit && onSubmit(emojiIndex);
  }

  render() {
    const {
      isMessenger,
      isScrambler,
      emojiList,
      scrambledMessage,
      originalMessage,
      timerSeconds,
    } = this.props;

    const allowedToVote = !isMessenger && !isScrambler;
    let specialRoleText = null;
    if (isScrambler) {
      specialRoleText = "You scrambled the original message: ";
    } else if (isMessenger) {
      specialRoleText = "Your original message was ";
    }
    return (
      <div>
        <EmojiBoard
          emojiList={emojiList}
          onEmojiClick={allowedToVote && this._onEmojiClick}
          goalEmojiIndex={allowedToVote && this.state.selectedEmojiIndex}
        />
        <p>
          {"Scrambled Message: " + scrambledMessage}
        </p>
        {allowedToVote
          ? null
          : <div>
            <p>Waiting for other players to vote...</p>
            <p className="specialRoleText">{specialRoleText}
              <span className="bold"> {originalMessage}</span>
            </p>
          </div>
        }

        <Clock timerSeconds={timerSeconds} />
      </div>

    );
  }
}

export default Voter;
