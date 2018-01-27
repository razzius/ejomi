import React, { Component } from 'react';

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
    return (
      <div>
        <p>
          Original message: {this.props.message}
        </p>
        <form>
          <label>
            Your scramble:
            <input type="text" name="name" value={this.state.value} onChange={this._onChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Scrambler;
