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
    const goalEmojiIndex = this.props.goalEmojiIndex;
    const emojis = this.props.emojiList.map((emoji,index) =>
      <EmojiCell
        onClick={() => {
          this.props.onEmojiClick && this.props.onEmojiClick(index);
        }}
        key={emoji.toString() + goalEmojiIndex}
        selected={goalEmojiIndex === index}
        value={emoji}
        votes={this.props.votes}
        users={this.props.users}
        index={index}
      />
    );

    return (
      <div className="board">
        {emojis}
      </div>
    );
  }
}

export default EmojiBoard;
