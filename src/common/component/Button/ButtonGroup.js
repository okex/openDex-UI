import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../IconLite';
import './BaseButton.less';
import BaseButton from './BaseButton';

const ButtonSize = {
  mini: 'mini',
  small: 'small',
  large: 'large',
  default: 'default',
};
export default class Button extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    shape: PropTypes.string,
    icon: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.string,
    block: PropTypes.bool,
    href: PropTypes.string,
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
    const { loading, icon, children, ...attr } = this.props;
    return (
      <BaseButton {...attr}>
        {icon && icon.length !== 0 && !loading && (
          <Icon className="icon-Loading loading-icon" />
        )}
        {<Icon className="icon-Loading loading-icon" />}
        {children}
      </BaseButton>
    );
  }
}

Button.btnType = BaseButton.btnType;
