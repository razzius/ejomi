import React, { Component } from 'react';

import Clock from './Clock.react';

class Voter extends Component {

  render() {
    // TODO: emoji board, w/ input
    return (
      <div>
        <p>
          {"Scrambled Message: " + this.props.scrambledMessage}
        </p>
        <Clock />
      </div>
    );
  }
}

export default Voter;
