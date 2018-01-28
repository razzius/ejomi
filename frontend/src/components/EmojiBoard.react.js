import React, { Component } from 'react';

function EmojiCell(props) {
  const classNames = "emojiCell" + (props.selected ? " selected" : "")
  const voterNames = getVoterNames(props)
  return (
    <div onClick={props.onClick}
      className = {classNames}>
      {props.value}
    </div>
  );
}


function getVoterNames(props) {
  const voterNames = []
  console.log(props.votes);
  for (let vote in props.votes) {
    console.log(vote);
    if (vote.selectedEmojiIndex === props.index) {
      voterNames.push(props.users[vote.userId].username)
    }
  }
  return voterNames;
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
