import React, { Component } from 'react';
import RevealingLetter from './RevealingLetter.react';
import './RevealingMessage.css'

class RevealingMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      transitioningTo: 'original',
    }

    this.textToDisplay = {
      'original': "Original message:",
      'scrambled': "Scrambled message:",
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
      <p>
         {this.textToDisplay[this.state.transitioningTo]}
      </p>
      <div className='revealingMessage'>
        {this.letterPairs.map(function(letters, index){
          return <RevealingLetter originalLetter={letters.originalLetter} scrambledLetter={letters.scrambledLetter}/>;
        })}
      </div>
      </div>
    );
  }
}

export default RevealingMessage;
