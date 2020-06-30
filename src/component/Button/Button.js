import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../IconLite';
import './Button.less';
import BaseButton from './BaseButton';
import { SIZE, TYPE } from './constants';

export default class Button extends React.PureComponent {
  static propTypes = {
    /** 设置按钮载入状态。引用该组件的工程中需要有 icon-Loading 图标 */
    loading: PropTypes.bool,
    /** 设置按钮为圆形 */
    circle: PropTypes.bool,
    /** 设置按钮的图标 图标需在引用该组件的工程中含有 */
    icon: PropTypes.string,
    /** 外部传入类，用于覆写样式 */
    className: PropTypes.string,
    /** 设置按钮大小，可选值为 mini small large default 请从Button.SIZE中选择 */
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
      loading, circle, icon, className, size, children, ...attr
    } = this.props;
    const loadingIcon = loading ? <Icon className="icon-Loading loading-icon btn-icon" /> : null;
    const customerIcon = icon && icon.length !== 0 && !loading ? <Icon className={`btn-icon ${icon}`} /> : null;

    return (
      <BaseButton
        {...attr}
        loading={loading}
        className={
          classNames(
            `size-${size}`,
            { circle },
            { [`circle-${size}`]: circle },
            { 'circle-icon': circle && !children },
            className
          )
        }
      >
        {loadingIcon}
        {customerIcon}
        {
          (loadingIcon || customerIcon) && children ? <span className="btn-content">{children}</span> : children
        }
      </BaseButton>
    );
  }
}

Button.btnType = TYPE;
Button.size = SIZE;

Button.TYPE = TYPE;
Button.SIZE = SIZE;
