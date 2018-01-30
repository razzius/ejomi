import React, { Component } from 'react'

class SkipButton extends Component {
    render() {
      return <button onClick={this.props.onSubmitSkip}>
        Skip
      </button>
    }
}

export default SkipButton
