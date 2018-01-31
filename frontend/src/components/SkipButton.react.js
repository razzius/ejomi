import React, { Component } from 'react'

class SkipButton extends Component {
  constructor(props) {
    super(props)
    this.state = {skipped: false}
  }

  skip() {
    this.setState({skipped: true})
    this.props.onSubmitSkip()
  }

  render() {
    return (
      !this.state.skipped &&
      <button onClick={this.skip.bind(this)}>
        Done
      </button>
    )
  }
}

export default SkipButton
