import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';
import RevealingLetter from './RevealingLetter.react';

class Revealer extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    this.letterPairs = [];
    for(let i = 0; i < this.props.originalMessage.length; i++){
      let originalLetter = this.props.originalMessage.charAt(i);
      let scrambledLetter = this.props.scrambledMessage.charAt(i);
      this.letterPairs.push({'originalLetter': originalLetter, 'scrambledLetter': scrambledLetter});
    }

    return (
      <div>
        <EmojiBoard
          goalEmojiIndex={this.props.goalEmojiIndex}
          emojiList={this.props.emojiList}
          votes= {this.props.votes}
           />
      <p> Original </p>
      <p> {this.props.originalMessage} </p>
      <p> Scrambled </p>
      <p> {this.props.scrambledMessage} </p>
      <div>
          {this.letterPairs.map(function(letters, index){
            return <RevealingLetter originalLetter={letters.originalLetter} scrambledLetter={letters.scrambledLetter}/>;
          })}
      </div>
    </div>
    );
  }
}

export default Revealer;
