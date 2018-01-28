import React, { Component } from 'react';
import ColorHash from '../color-hash';

class Lobby extends Component {

  constructor(props) {
    super(props);
    this.colorHash = new ColorHash();
  }

  _renderName = (name) => {
    const colorHex = this.colorHash.hex(name);
    const style = { color: colorHex }
    return <p className="userInList" key={name} style={style}>{name}</p>;
  }

  render() {
    return (
      <div>
        {this.props.userList.map(this._renderName)}
      </div>
    );
  }
}

export default Lobby;
