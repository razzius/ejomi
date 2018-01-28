import React, { Component } from 'react';

import Clock from './Clock.react';
import Message from './Message.react';

class Voter extends Component {

  render() {
    // TODO: emoji board, w/ input
    return (
      <div>
        <p>
          {"Scrambled Message: " + this.props.scrambledMessage}
        </p>
        <Clock />
        <Message text={this.props.scrambledMessage}/>
      </div>

    );
  }
}

export default Voter;
