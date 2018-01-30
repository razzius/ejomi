import React, { Component } from 'react';

// props: referenceString, onSubmit: string -> void
class SkipButton extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    return (
      <button onClick={this.props.onSubmitSkip}>
          Ready
      </button>
    );
  }
}

export default SkipButton
