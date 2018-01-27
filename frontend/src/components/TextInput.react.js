import React, { Component } from 'react';

function generateForSelectedPos(index, emojis) {
  return emojis;
}

class TextInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      maxSize: 10,
      maxEditDistance: 4
    };
  }

  _handleChange = (event) => {
    console.log(event.target.value);
    this.setState({value: event.target.value});
  };

  render() {

    const warning = this.state.value.length > this.state.maxSize
      ? <p>YOU WROTE TOO MUCH</p>
      : null;

    return (
      <div>
        <label>
          <input type="text" name="name" value={this.state.value} onChange={this._handleChange} />
        </label>
        <input type="submit" value="Submit" />

        {warning}
      </div>
    );
  }
}

export default TextInput
