import React, { Component } from 'react';
import emoji from 'react-easy-emoji';

function EmojiCell(props) {
  const classNames = "emojiCell" + (props.selected ? " selected" : "")
  const voterNames = getVoterNames(props)
  let voterHtml = "";

  for (var i = 0; i < voterNames.length; i++) {
        voterHtml += voterNames[i] + " "
    }
  return (
      <div onClick={props.onClick}
        className={classNames}>
        {emoji(props.value)}
        <span className='voterName'>{voterHtml} </span>
      </div>
  );
}

function randomizedCells(props) {
  const goalEmojiIndex = props.goalEmojiIndex;
  const emojis = props.emojiList.map((emoji,index) =>
    <EmojiCell
      onClick={() => {
        props.onEmojiClick && props.onEmojiClick(index);
      }}
      key={emoji.toString() + goalEmojiIndex}
      selected={goalEmojiIndex === index}
      value={emoji}
      votes={props.votes}
      users={props.users}
      index={index}
    />
  );
  const shiftAmount = Math.random() * emojis.length + 1;
  for (var i = 0; i < shiftAmount; i++) {
    emojis.push(emojis.shift());
  }
  return emojis;
}

function getVoterNames(props) {
  const voterNames = []
  for (let userId in props.votes) {
    if (props.votes[userId] === props.index) {
      const username = getNameForId(userId, props.users);
      if (username) {
        console.log("adding " + username)
        voterNames.push(username)
      }
    }
  }
  return voterNames;
}

function getNameForId(userId, users) {
  for (let user in users) {
    if (user === userId) {
      return users[user].username;
    }
  }
  return undefined;
}

class EmojiBoard extends Component {

  // we need to make key depend on the props which are changing, or it won't re-render
  // seems to be a react bug
  // see https://stackoverflow.com/questions/45445724/component-in-react-doesnt-render-when-in-map-function/46311414#46311414
  render() {
    return (
      <div className="board">
        {randomizedCells(this.props)}
      </div>
    );
  }
}

export default EmojiBoard;
