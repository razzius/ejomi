import React, { Component } from 'react'
import randomEmoji from 'random-emoji'

class EmojiHaiku extends Component {

  constructor(props) {
    super(props);
    this.state = {
        haiku: randomEmoji.haiku()
    }
  }

  render() {
    var emojiLines = this.state.haiku.map(line => line.map(e => e.character))

    var emojiWords = this.state.haiku.map(line => line.map(e => e.name).join(' '))

    return <div style={{paddingBottom: "25px"}}>
      <h1>{emojiLines.map(line => <div>{line}</div>)}</h1>
      <p style={{fontSize: "20px"}}>{emojiWords.map(line => <div><i>{line}</i></div>)}</p>
    </div>
  }

}

export default EmojiHaiku
