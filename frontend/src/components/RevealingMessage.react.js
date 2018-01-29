import React, { Component } from 'react';
import RevealingLetter from './RevealingLetter.react';
import './RevealingMessage.css'

class RevealingMessage extends Component {

  render() {

    return (
      <div className='revealingMessage'>
          {this.props.letterPairs.map(function(letters, index){
            return <RevealingLetter originalLetter={letters.originalLetter} scrambledLetter={letters.scrambledLetter}/>;
          })}
      </div>
    );
  }
}

export default RevealingMessage;
