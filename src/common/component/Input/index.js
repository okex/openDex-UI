import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../IconLite';
import './index.less';

const prefixCls = 'ok-ui-input';
export default class Input extends React.Component {
  static propTypes = {
    suffix: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.func,
    ]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    allowClear: PropTypes.bool,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.func,
    ]),
    type: PropTypes.string,
    value: PropTypes.string,
    theme: PropTypes.oneOf(['', 'dark']),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    suffix: '',
    placeholder: '',
    disabled: false,
    error: '',
    value: '',
    theme: '',
    readOnly: false,
    allowClear: false,
    type: 'text',
    onChange: null,
  };

  handleClearInput = () => {
    this.props.onChange({ target: { value: '' } });
  };

  renderInput = () => {
    const extraProps = ['suffix', 'error', 'theme', 'allowClear'];

    const inputProps = Object.keys(this.props).reduce((props, key) => {
      const propsClone = { ...props };
      if (!extraProps.includes(key)) {
        propsClone[key] = this.props[key];
      }
      return propsClone;
    }, {});
    return <input {...inputProps} />;
  };

  renderSuffix = () => {
    const { suffix, allowClear, value } = this.props;
    let children = suffix;
    if (typeof suffix === 'function') {
      children = suffix();
    }
    return (
      <div className={`${prefixCls}-suffix`}>
        {allowClear && value && (
          <span onClick={this.handleClearInput}>
            <Icon className="icon-close-circle" />
          </span>
        )}
        {children}
      </div>
    );
  };

  renderError = (error) => {
    if (typeof error !== 'function') {
      return <span className={`${prefixCls}-error`}>{error}</span>;
    }
    return <span className={`${prefixCls}-error`}>{error()}</span>;
  };

  render() {
    const { theme, style, disabled, error } = this.props;
    const clsName = classnames(
      prefixCls,
      { disabled },
      theme === 'dark' && 'dark',
      error && 'error'
    );
    return (
      <div className={clsName} style={style}>
        <div style={{ position: 'relative' }}>
          {this.renderInput()}
          {this.renderSuffix()}
        </div>
        {error && this.renderError(error)}
      </div>
    );
  }
}
