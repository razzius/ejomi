import React, { Component } from 'react';

class Clock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTimeRemaining: this.props.timerSeconds,
    }

    setInterval(this.tick, 1000);
  }

  tick = () => {
    this.setState({
        currentTimeRemaining: Math.max(this.state.currentTimeRemaining - 1, 0)
    });
  }

  render() {
    return (
      <div className="clockText">
      {this.state.currentTimeRemaining}
      <span> sec remaining</span>
      </div>
    );
  }
}

export default Clock;
