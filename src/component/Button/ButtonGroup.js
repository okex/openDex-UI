import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../IconLite';
import './BaseButton.less';
import BaseButton from './BaseButton';

const ButtonSize = {
  mini: 'mini',
  small: 'small',
  large: 'large',
  default: 'default'
};
export default class Button extends React.PureComponent {
  static propTypes = {
    /** 设置按钮载入状态 */
    loading: PropTypes.bool,
    /** 设置按钮形状，可选值为 circle */
    shape: PropTypes.string,
    /** 设置按钮的图标类型 */
    icon: PropTypes.string,
    /** 外部传入类 */
    className: PropTypes.string,
    /** 设置按钮大小，可选值为 small large 或者不设 */
    size: PropTypes.string,
    /** 将按钮宽度调整为其父宽度的选项 */
    block: PropTypes.bool,
    /** 点击跳转的地址，指定此属性 button 的行为和 a 链接一致 */
    href: PropTypes.string,
    /** 相当于 a 链接的 target 属性，href 存在时生效 */
    target: PropTypes.string,
  };

  static defaultProps = {
    loading: false,
    shape: '',
    icon: '',
    className: '',
    size: ButtonSize.default,
    block: false,
    href: '',
    target: '',
  };

  render() {
    const {
      loading, shape, icon, className, size, block, href, target, children, ...attr
    } = this.props;
    return (
      <BaseButton
        {...attr}
      >
        {
          icon && icon.length !== 0 && !loading &&
          <Icon className="icon-Loading loading-icon" />
        }
        {
          // loading &&
          <Icon className="icon-Loading loading-icon" />
        }
        {children}
      </BaseButton>
    );
  }
}

Button.btnType = BaseButton.btnType;
