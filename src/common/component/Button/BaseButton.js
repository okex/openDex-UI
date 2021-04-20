import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './BaseButton.less';
import { TYPE, THEME } from './constants';

export default class BaseButton extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    type: PropTypes.oneOf([
      TYPE.default,
      TYPE.primary,
      TYPE.info,
      TYPE.success,
      TYPE.warn,
      TYPE.error,
    ]),
    htmlType: PropTypes.string,
    onClick: PropTypes.func,
    href: PropTypes.string,
    target: PropTypes.string,
    block: PropTypes.bool,
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
    theme: THEME.default,
  };

  render() {
    const {
      children,
      type,
      className,
      htmlType,
      onClick,
      disabled,
      block,
      href,
      target,
      theme,
      loading,
      ...attr
    } = this.props;
    const Type = (btnType) => type.indexOf(btnType) !== -1;

    const button = (
      <button
        disabled={disabled || loading}
        {...attr}
        type={htmlType}
        onClick={onClick}
        className={classNames(
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
        )}
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
        className={classNames(
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
        )}
      >
        {children}
      </a>
    );

    const content = href && !disabled ? hrefButton : button;

    return content;
  }
}
