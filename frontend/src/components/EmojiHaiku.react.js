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
      <h1>
        {emojiLines.map((line, lineIndex) => <div key={lineIndex}>
          {
            line.map((e, index) => <span key={index} style={{padding: "10px"}}>{e}</span>)
          }
          </div>)
        }
      </h1>
      <span style={{fontSize: "20px"}}>{emojiWords.map((line, index) => <p key={index}><i>{line}</i></p>)}</span>
    </div>
  }

}

export default EmojiHaiku
