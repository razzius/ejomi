import React, { Component } from 'react'
import randomEmoji from 'random-emoji'
import emoji from 'react-easy-emoji'
import './EmojiHaiku.css'

class EmojiHaiku extends Component {

  constructor(props) {
    super(props);
    this.state = {
        haiku: randomEmoji.haiku()
    }
  }

  render() {
    const emojiLines = this.state.haiku.map(line => line.map(e => e.character).join(' '))

    const emojiWords = this.state.haiku.map(line => line.map(e => e.name.replace(/_/g,' ')).join(' '))
    let haikuHTML = [];
    for (var i = 0; i < 3; i++) {
        haikuHTML.push(<div className="haiku-line">
          <div className="emoji-line"> {emojiLines[i]}
          </div>
        <div className="text-line"><i>{emojiWords[i]}
        </i></div>
      </div>);
    }
    return <div style={{paddingBottom: "25px"}}>
               {haikuHTML}
           </div>
  }

}

export default EmojiHaiku
