import React, { Component } from 'react';
import ColorHash from '../color-hash';

class Lobby extends Component {

  constructor(props) {
    super(props);
    this.colorHash = new ColorHash();
  }

  renderName = (name) => {
    const colorHex = this.colorHash.hex(name);
    const style = { color: colorHex }
    return <p className="userInList" style={style}>{name}</p>;
  }

  render() {
    return (
      <div>
      { this.props.userList.map((name) => {
          return this.renderName(name)
        })
      }
      </div>
    );
  }
}

export default Lobby;
