import React, { Component } from 'react';
import ColorHash from '../color-hash';

class Lobby extends Component {

  constructor(props) {
    super(props);
    this.colorHash = new ColorHash();
    this.state = {
      showJoin: true,
    }
  }

  _renderName = (name) => {
    const colorHex = this.colorHash.hex(name);
    const style = { color: colorHex }
    return <p className="userInList" key={name} style={style}>{name}</p>;
  }

  _onJoin = () => {
    this.props.onJoin(this.input.value)
    this.setState({
      showJoin: false
    });
  }

  render() {
    const inputForm = this.state.showJoin ?
      <div>
        <input
          type="text"
          ref={input => {this.input = input;}}
        />
        <div>
          <button onClick={this._onJoin}>Join</button>
        </div>
      </div> : null;

    const startButton = this.props.showStart ?
    <div>
      <button onClick={this.props.onStart}>Start</button>
    </div> : null;

    return (
      <div>
        {inputForm}
        {startButton}
        {this.props.userList.map(this._renderName)}
      </div>
    );
  }
}

export default Lobby;
