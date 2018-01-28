import React, { Component } from 'react';
import TextInput from './TextInput.react';

class Messenger extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TextInput />
      </div>
    );
  }
}

export default Messenger;
