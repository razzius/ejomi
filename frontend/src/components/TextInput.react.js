import React, { Component } from 'react';
import levenshtein from 'fast-levenshtein';

function getEditDistance(a, b) {
  const length = Math.min(a.length, b.length);
  let mismatches = Math.abs(a.length - b.length);
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) {
      mismatches++;
    }
  }

  return mismatches;
}

// props: referenceString, onSubmit: string -> void
class TextInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.referenceString || '',
      maxSize: 10,
      maxEditDistance: 4
    };
  }

  _handleChange = (event) => {
    const referenceString = this.props.referenceString;
    const {
      maxEditDistance,
      maxSize,
    } = this.state;

    const value = event.target.value;
    if (value.length <= maxSize
      && (!referenceString || levenshtein.get(value, referenceString) <= maxEditDistance)
    ) {
      this.setState({value});
      this.props.onSubmit && this.props.onSubmit(value);
    }
  };

  render() {
    const referenceString = this.props.referenceString;
    const {
      maxEditDistance,
      value,
    } = this.state;

    const lengthWarning = <p>{value.length}/{this.state.maxSize} characters</p>

    let editWarning = null;
    if (referenceString) {
      const editDistance = levenshtein.get(value, referenceString);
      editWarning = <p>{editDistance}/{maxEditDistance} edits</p>;
    }

    return (
      <form onSubmit= {(e) => e.preventDefault() }>
        <label>
          <input type="text" value={value} onChange={this._handleChange} placeholder = {this.props.placeHolder}
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
        </label>
        {lengthWarning}
        {editWarning}
      </form>
    );
  }
}

export default TextInput
