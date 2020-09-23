import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../IconLite';
import './Button.less';
import BaseButton from './BaseButton';
import { SIZE, TYPE } from './constants';

export default class Button extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    circle: PropTypes.bool,
    icon: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.oneOf([SIZE.default, SIZE.mini, SIZE.small, SIZE.large]),
  };

  static defaultProps = {
    loading: false,
    circle: false,
    icon: '',
    className: '',
    size: SIZE.default,
  };

  render() {
    const {
      loading,
      circle,
      icon,
      className,
      size,
      children,
      ...attr
    } = this.props;
    const loadingIcon = loading ? (
      <Icon className="icon-Loading loading-icon btn-icon" />
    ) : null;
    const customerIcon =
      icon && icon.length !== 0 && !loading ? (
        <Icon className={`btn-icon ${icon}`} />
      ) : null;

    return (
      <BaseButton
        {...attr}
        loading={loading}
        className={classNames(
          `size-${size}`,
          { circle },
          { [`circle-${size}`]: circle },
          { 'circle-icon': circle && !children },
          className
        )}
      >
        {loadingIcon}
        {customerIcon}
        {(loadingIcon || customerIcon) && children ? (
          <span className="btn-content">{children}</span>
        ) : (
          children
        )}
      </BaseButton>
    );
  }
}

Button.btnType = TYPE;
Button.size = SIZE;

Button.TYPE = TYPE;
Button.SIZE = SIZE;
