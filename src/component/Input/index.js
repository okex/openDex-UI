import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../IconLite';
import './index.less';

const prefixCls = 'ok-ui-input';
export default class Input extends React.Component {
  static propTypes = {
    // prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
    /** 带有后缀的 input */
    suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
    /** placeholder */
    placeholder: PropTypes.string,
    /** disabled */
    disabled: PropTypes.bool,
    /** readOnly */
    readOnly: PropTypes.bool,
    /** 可以点击清除图标删除内容 */
    allowClear: PropTypes.bool,
    /** 错误描述信息 */
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
    /** 声明 input 类型，同原生 input 标签的 type 属性 */
    type: PropTypes.string,
    /** 输入框内容 */
    value: PropTypes.string,
    /** 主题 可选“dark” */
    theme: PropTypes.oneOf(['', 'dark']),
    /** 输入框内容变化时的回调 */
    onChange: PropTypes.func
  };

  static defaultProps = {
    // prefix: '',
    suffix: '',
    placeholder: '',
    disabled: false,
    error: '',
    value: '',
    theme: '',
    readOnly: false,
    allowClear: false,
    type: 'text',
    onChange: null
  };
  handleClearInput = () => {
    this.props.onChange({ target: { value: '' } });
  }
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

  // renderPrefix = (prefix) => {
  //   let children = prefix;
  //   if (typeof prefix === 'function') {
  //     children = prefix();
  //   }
  //   return <span className={`${prefixCls}-prefix`}>{children}</span>;
  // };

  renderSuffix = () => {
    const { suffix, allowClear, value } = this.props;
    let children = suffix;
    if (typeof suffix === 'function') {
      children = suffix();
    }
    return (
      <div className={`${prefixCls}-suffix`}>
        {allowClear && value && <span onClick={this.handleClearInput} ><Icon className="icon-close-circle" /></span>}
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
    const {
      theme, style, disabled, error
    } = this.props;
    const clsName = classnames(prefixCls, { disabled }, theme === 'dark' && 'dark', error && 'error');
    return (
      <div className={clsName} style={style}>
        <div style={{ position: 'relative' }}>
          {/* {prefix && this.renderPrefix(prefix)} */}
          {this.renderInput()}
          {this.renderSuffix()}
        </div>
        {
          error && this.renderError(error)
        }
      </div>
    );
  }
}
