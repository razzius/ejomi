import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';
import RevealingLetter from './RevealingLetter.react';
import RevealingMessage from './RevealingMessage.react';
import Clock from './Clock.react';

class Revealer extends Component {

  constructor(props) {
    super(props);

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
          votes={this.props.votes}
          users={this.props.users}
           />
      <RevealingMessage letterPairs={this.letterPairs}/>
      <p> Original </p>
      <p> {this.props.originalMessage} </p>
      <p> Scrambled </p>
      <p> {this.props.scrambledMessage} </p>
      <div>
          {this.letterPairs.map(function(letters, index){
            return <RevealingLetter originalLetter={letters.originalLetter} scrambledLetter={letters.scrambledLetter}/>;
          })}
      </div>
      <Clock timerSeconds={this.props.timerSeconds} />
    </div>
    );
  }
}

export default Revealer;
