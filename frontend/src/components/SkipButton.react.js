import React, { Component } from 'react';

// props: referenceString, onSubmit: string -> void
class SkipButton extends Component {

  constructor(props) {
    super(props);

  }

  _handleClick = (event) => {
    const onSubmitSkip = this.props.onSubmitSkip;
    onSubmitSkip;
  };

  render() {

    return (
      <button onClick={_handleClick}> Ready
      </button>
    );
  }
}

export default TextInput
