import React, { Component } from 'react';
import './EmojiBoard.css';

function EmojiCell(props) {
  return <div>
          {props.selected ? '[ ' : ''}{props.value}{props.selected ? ' ]' : ''}
        </div>;
}

class EmojiBoard extends Component {

  constructor(props) {
    super(props);
    // const this.messageIndex = props.messageIndex; //int
    // const emojiList = props.emojiList;    //list
  }


  render() {

    const emojis = this.props.emojiList.map( (emoji,index) =>
      <EmojiCell value={emoji} selected={this.props.messageIndex == index}/>
    );

    return (
      <div class="EmojiBoard">
        {emojis}
      </div>
    );
  }
}

export default EmojiBoard;
