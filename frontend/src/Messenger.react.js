import React, { Component } from 'react';

const MAX_LENGTH = 10;
const EMOJIS = "ABCDEF";//'😂😄😃😀😊😉😍😘😚😗';

function generateForSelectedPos(index, emojis) {
  return emojis;
}

class Messenger extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  _handleChange = (event) => {
    console.log(event.target.value);
    this.setState({value: event.target.value});
  };

  render() {
    // const emojis = "ABCDEFG";
    // const selectedEmoji = emojis.charAt(selectedEmojiIndex);

    console.log(this.props.selectedEmojiIndex);
    console.log(this.props);

    const warning = this.state.value.length > MAX_LENGTH
      ? <p>YOU WROTE TOO MUCH</p>
      : null;

    return (
      <div>
        <p>
          {generateForSelectedPos(3, "EMOJIS")}
        </p>
        <form>
          <label>
            Name:
            <input type="text" name="name" value={this.state.value} onChange={this._handleChange} />
          </label>
          <input type="submit" value="Submit" />
          {warning}
        </form>
      </div>
    );
  }
}

export default Messenger;
