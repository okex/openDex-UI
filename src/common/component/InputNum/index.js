import React from 'react';

export default class InputNum extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  onBlur = (e) => {
    const { onBlur } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onBlur !== 'undefined') {
      onBlur(inpNumber, e);
    }
  };

  onClick = (e) => {
    const { onClick } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onClick !== 'undefined') {
      onClick(inpNumber, e);
    }
  };

  onCut = (e) => {
    const { onCut } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onCut !== 'undefined') {
      onCut(inpNumber, e);
    }
  };

  onCopy = (e) => {
    const { onCopy } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onCopy !== 'undefined') {
      onCopy(inpNumber, e);
    }
  };

  onDoubleClick = (e) => {
    const { onDoubleClick } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onDoubleClick !== 'undefined') {
      onDoubleClick(inpNumber, e);
    }
  };

  onFocus = (e) => {
    const { onFocus } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onFocus !== 'undefined') {
      onFocus(inpNumber, e);
    }
  };

  onKeyDown = (e) => {
    this.cusorStart = this.input.current.selectionStart;
    const { onKeyDown } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onKeyDown !== 'undefined') {
      onKeyDown(inpNumber, e);
    }
  };

  onChange = (e) => {
    const { onChange } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onChange !== 'undefined') {
      onChange(inpNumber, e);
    }
  };

  onKeyUp = (e) => {
    const { onKeyUp } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onKeyUp !== 'undefined') {
      onKeyUp(inpNumber, e);
    }
  };

  onKeyPress = (e) => {
    this.cusorStart = this.input.current.selectionStart;
    const { onKeyPress } = this.props;
    let inpNumber = this.checkInpNumber(e.target.value);
    if (typeof onKeyPress !== 'undefined') {
      onKeyPress(inpNumber, e);
    }
  };

  checkInpNumber = (inputValue, num) => {
    if(inputValue === '.') inputValue = '0.';
    let inps = inputValue.replace('。', '.').split('.');
    let inpNumber = '';
    if (inps.length > 1) {
      if (typeof num != 'undefined' || num === -1) {
        inpNumber =
          inps[0].replace(/\D/g, '') + '.' + inps[1].replace(/\D/g, '');
      } else {
        inpNumber =
          inps[0].replace(/\D/g, '') +
          '.' +
          inps[1].replace(/\D/g, '').slice(0, num);
      }
    } else {
      inpNumber = inps[0].replace(/\D/g, '').replace(/0*(\d+)/, '$1');
    }
    return this._precision(inpNumber);
  };

  _precision(inpNumber) {
    if (this.props.precision) {
      const inpNumbers = ('' + inpNumber).split('.');
      if (inpNumbers[1]) {
        inpNumbers[1] = inpNumbers[1].substring(0, this.props.precision);
        inpNumber = inpNumbers[0] + '.' + inpNumbers[1];
      }
    }
    return inpNumber;
  }

  removeDot = (value) => {
    if (typeof value != 'number' && typeof value != 'string') {
      return value;
    }
    let newValue = String(value).replace(/,/g, '');
    return newValue;
  };

  addDot = (value) => {
    if (typeof value != 'number' && typeof value != 'string') {
      return value;
    }
    if (Math.abs(value) < 1000) {
      return value;
    }
    let newValue = String(value).replace(/,/g, '');
    let inpArr = newValue.split('.');

    let l = inpArr[0].split('').reverse(),
      t = '';
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
    }
    if (inpArr.length == 2) {
      return t.split('').reverse().join('') + '.' + inpArr[1];
    } else {
      return t.split('').reverse().join('');
    }
  };

  shouldComponentUpdate(nextProps) {
    if (!this.cusorStart) return true;
    const oldValue = this.getNewValue();
    const newValue = this.getNewValue(nextProps);
    const cusorStep = newValue.length - oldValue.length;
    if (cusorStep) this.cusorStep = cusorStep;
    else this.cusorStep = newValue.length;
    return true;
  }

  componentDidUpdate() {
    const input = this.input.current;
    if (this.cusorStart) {
      input.selectionStart = this.cusorStart + this.cusorStep;
      input.selectionEnd = this.cusorStart + this.cusorStep;
    }
    this.cusorStart = null;
    this.cusorStep = null;
  }

  getNewValue(props = this.props) {
    const { value } = props;
    let newValue = this.removeDot(value);
    newValue = this.addDot(newValue);
    return this._precision(newValue);
  }

  render() {
    return (
      <input
        {...this.props}
        type="text"
        onCopy={this.onCopy}
        onBlur={this.onBlur}
        onClick={this.onClick}
        onChange={this.onChange}
        onCut={this.onCut}
        onDoubleClick={this.onDoubleClick}
        onFocus={this.onFocus}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        onKeyPress={this.onKeyPress}
        value={this.getNewValue()}
        ref={this.input}
      />
    );
  }
}
