import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';
import TextInput from './TextInput.react';

// props: emojis
class Messenger extends Component {

  render() {
    return (
      <div>
        <EmojiBoard
          messageIndex={this.props.selectedEmojiIndex}
          emojiList={this.props.emojiList}
          counterIndex={0} />
        <p>Describe the above selected emoji:</p>
        <TextInput onSubmit={this.props.onSubmit} />
      </div>
    );
  }
}

export default Messenger;
