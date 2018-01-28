import React, { Component } from 'react';

class Clock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTimeRemaining: 20,
    }

    let timer = setInterval(this.tick, 1000);
  }

  tick = () => {
    this.setState({
        currentTimeRemaining: this.state.currentTimeRemaining - 1
    });
  }

  render() {
    return (
      <div>
      {this.state.currentTimeRemaining}
      </div>
    );
  }
}

export default Clock;
