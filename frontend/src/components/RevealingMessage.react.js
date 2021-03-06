import React, { Component } from 'react';
import RevealingLetter from './RevealingLetter.react';
import './RevealingMessage.css'

class RevealingMessage extends Component {

  constructor(props) {
    super(props);

    this.textToDisplay = {
      'original': "The scrambled message was " + this.props.scrambledMessage + " and the original message was... ",
      'voter': null,
      'ejomi': null,
    }
  }

  render() {
    this.letterPairs = [];
    for(let i = 0; i < this.props.originalMessage.length; i++){
      let originalLetter = this.props.originalMessage.charAt(i);
      let scrambledLetter = this.props.scrambledMessage.charAt(i);
      this.letterPairs.push({'originalLetter': originalLetter,
                             'scrambledLetter': scrambledLetter,
                             'mode': this.props.mode,
                            });
    }

    return (
      <div>
        <p className="displayText">
          {this.textToDisplay[this.props.state]}
        </p>
        <div className='revealingMessage'>
          {this.letterPairs.map(function(letters, index){
            return <RevealingLetter
              mode={letters.mode}
              originalLetter={letters.originalLetter}
              scrambledLetter={letters.scrambledLetter}
            />;
          })}
        </div>
      </div>
    );
  }
}

export default RevealingMessage;
