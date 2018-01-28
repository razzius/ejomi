import React, { Component } from 'react';
import './EmojiBoard.css';

function EmojiCell(props) {
  return (
    <div onClick={props.onClick}>
      {props.selected ? '[ ' : ''}{props.value}{props.selected ? ' ]' : ''}
    </div>
  );
}

// props:
// messageIndex: int
// emojiList: list
class EmojiBoard extends Component {

  // we need to make key depend on the props which are changing, or it won't re-render
  // seems to be a react bug
  // see https://stackoverflow.com/questions/45445724/component-in-react-doesnt-render-when-in-map-function/46311414#46311414
  render() {
    const messageIndex = this.props.messageIndex;
    const emojis = this.props.emojiList.map((emoji,index) =>
      <EmojiCell
        onClick={() => {
          this.props.onEmojiClick && this.props.onEmojiClick(index);
        }}
        key={emoji.toString() + messageIndex}
        selected={messageIndex === index}
        value={emoji}
      />
    );

    return (
      <div className="EmojiBoard">
        {emojis}
      </div>
    );
  }
}

export default EmojiBoard;
