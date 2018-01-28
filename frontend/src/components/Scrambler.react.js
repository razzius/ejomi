import React, { Component } from 'react';
import TextInput from './TextInput.react';

// props: message
class Scrambler extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.message,
    };
  }

  _onChange = (event) => {
    this.setState({value: event.target.value});
  };

  render() {
    const message = this.props.message;
    return (
      <div>
        <p>Original message: {message}</p>
        <p>Your scramble:</p>
        <TextInput referenceString={message} />
      </div>
    );
  }
}

export default Scrambler;
