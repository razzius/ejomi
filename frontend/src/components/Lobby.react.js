import React, { Component } from 'react';
import ColorHash from '../color-hash';

class Lobby extends Component {

  constructor(props) {
    super(props);
    this.colorHash = new ColorHash();
    this.state = {
      showJoin: true,
      currentUser: ""
    }
  }

  _renderName = (name) => {
    const colorHex = this.colorHash.hex(name);
    const isCurrentUser = name === this.state.currentUser;
    const fontWeight = isCurrentUser ? "bold" : "normal"
    const style = { color: colorHex,
                    "font-weight": fontWeight}
    return <p className="userInList" key={name} style={style}>{name}</p>;
  }

  _onJoin = () => {
    if (this.input.value.length == 0) {
      return;
    }
    this.setState({
      showJoin: false,
      currentUser: this.input.value
    });
    this.props.onJoin(this.input.value)
  }

  render() {
    const inputForm = this.state.showJoin ?
      <div>
        <input
          type="text"
          ref={input => {this.input = input;}}
          className="inputBox"
          placeholder="Payler naem gose here"
        />
        <button className="inputButton" onClick={this._onJoin}>Join</button>
      </div> : null;

    const startButton = this.props.showStart ?
    <div>
      <button onClick={this.props.onStart}>Start</button>
    </div> : null;


    const numberPlayers = this.props.userList.length + (this.props.userList.length == 1 ? " Player in Lobby:" :" Players in Lobby:");
    const header = <h5> {numberPlayers} </h5>

    return (
      <div>
        {inputForm}
        {startButton}
        {header}
        {this.props.userList.sort((name) => { return name === this.state.currentUser ? -1: 1;})
          .map(this._renderName)}
      </div>
    );
  }
}

export default Lobby;
