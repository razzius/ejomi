import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';
import TextInput from './TextInput.react';

// props: emojis
class Messenger extends Component {

  render() {
    const describeText = "Describe the selected emoji with " + this.props.characterLimit + " letters"
    return (
      <div>
        <EmojiBoard
          messageIndex={this.props.selectedEmojiIndex}
          emojiList={this.props.emojiList}
          counterIndex={0} />
        <TextInput onSubmit={this.props.onSubmit} placeHolder={describeText} />
      </div>
    );
  }
}

export default Messenger;
