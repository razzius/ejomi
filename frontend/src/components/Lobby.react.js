import React, { Component } from 'react';
import ColorHash from '../color-hash';
import EmojiHaiku from './EmojiHaiku.react';

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
                    fontWeight: fontWeight}
    return <p className="userInList" key={name} style={style}>{name}</p>;
  }

  _onJoin = (e) => {
    e.preventDefault()

    if (this.input.value.length === 0) {
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
      <form onSubmit={this._onJoin}>
        <input
          type="text"
          ref={input => {this.input = input;}}
          className="inputBox"
          placeholder="Player Name"
        />
        <button type="submit" className="inputButton">Join</button>
      </form> : null;

    const startButton = this.props.showStart ?
    <div>
      <button onClick={this.props.onStart}>Start</button>
    </div> : null;

    const addPlayersText = !this.props.showStart ? " (need " + (3 - this.props.userList.length) + " more)" : "";
    const playerMessage = this.props.userList.length + (this.props.userList.length === 1 ? " Player in Lobby:" :" Players in Lobby:" + addPlayersText);

    return (
      <div>
        <EmojiHaiku/>
        {inputForm}
        {startButton}
        <h5 className="playerMessage">{playerMessage} </h5>
        <div className="userList" >
            {this.props.userList.sort((name) => { return name === this.state.currentUser ? -1: 1;})
            .map(this._renderName)}
          </div>
      </div>
    );
  }
}

export default Lobby;
