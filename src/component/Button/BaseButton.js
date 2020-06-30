import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './BaseButton.less';
import { TYPE, THEME } from './constants';

export default class BaseButton extends React.PureComponent {
  static propTypes = {
    /** 按钮使能 */
    disabled: PropTypes.bool,
    /** 按钮类型 可选值为 primary success info warning error default。根据UI规范 目前只需要用到 primary/default，请从Button.TYPE的常量中选择 */
    type: PropTypes.oneOf([TYPE.default, TYPE.primary, TYPE.info, TYPE.success, TYPE.warn, TYPE.error]),
    /** button 原生的 type 值 */
    htmlType: PropTypes.string,
    /** click 事件的 handler */
    onClick: PropTypes.func,
    /** 点击跳转的地址，指定此属性 button 的行为和 a 链接一致。 有该属性最终会被渲染为a标签。但同时带有disabled属性会渲染为button标签 */
    href: PropTypes.string,
    /** 相当于 a 链接的 target 属性，href 存在时生效。 */
    target: PropTypes.string,
    /** 将按钮宽度调整为其父宽度的选项 */
    block: PropTypes.bool,
    /** 主题或模式 支持 dark 即夜间模式 请从Button.THEME中选择 */
    theme: PropTypes.oneOf([THEME.default, THEME.dark]),
  };

  static defaultProps = {
    disabled: false,
    type: TYPE.default,
    htmlType: 'button',
    onClick: null,
    href: '',
    target: '',
    block: false,
    theme: THEME.default
  };

  render() {
    const {
      children, type, className, htmlType, onClick, disabled, block, href, target, theme, loading, ...attr
    } = this.props;
    const Type = (btnType) => {
      return type.indexOf(btnType) !== -1;
    };

    const button = (
      <button
        disabled={disabled || loading}
        {...attr}
        type={htmlType}
        onClick={onClick}
        className={
          classNames(
            'btn',
            { block },
            { [theme]: theme },
            { 'btn-primary': Type(TYPE.primary) },
            { 'btn-warning': Type(TYPE.warn) },
            { 'btn-success': Type(TYPE.success) },
            { 'btn-error': Type(TYPE.error) },
            { 'btn-default': Type(TYPE.default) },
            { 'btn-info': Type(TYPE.info) },
            { 'btn-disabled': disabled && !loading },
            className
          )
        }
      >
        {children}
      </button>
    );
    const hrefButton = (
      <a
        href={href}
        target={target}
        {...attr}
        onClick={onClick}
        className={
          classNames(
            'btn',
            'btn-link',
            { block },
            { 'btn-primary': Type(TYPE.primary) },
            { 'btn-warning': Type(TYPE.warn) },
            { 'btn-success': Type(TYPE.success) },
            { 'btn-error': Type(TYPE.error) },
            { 'btn-default': Type(TYPE.default) },
            { 'btn-info': Type(TYPE.info) },
            { 'btn-disabled': disabled },
            className
          )
        }
      >
        {children}
      </a>
    );

    const content = href && !disabled ? hrefButton : button;

    return (content);
  }
}
