import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../IconLite';
import './index.less';

const typeIcon = {
  error: 'icon-close-circle',
  warn: 'icon-exclamation-circle',
  info: 'icon-info-circle',
  success: 'icon-check-circle',
};

const AlertType = {
  success: 'success',
  info: 'info',
  warn: 'warn',
  error: 'error',
};

const prefixCls = 'ok-ui-alert';

export default class Alert extends React.PureComponent {
  static propTypes = {
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    closable: PropTypes.bool,
    closeText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    showIcon: PropTypes.bool,
    type: PropTypes.string,
    onClose: PropTypes.func,
    operation: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    operationClick: PropTypes.func,
  };

  static defaultProps = {
    message: '',
    description: '',
    closable: true,
    closeText: '',
    showIcon: true,
    type: AlertType.info,
    onClose: null,
    operation: '',
    operationClick: null,
  };

  render() {
    const {
      message,
      onClose,
      closable,
      type,
      description,
      closeText,
      showIcon,
      operation,
      operationClick,
    } = this.props;

    let closeJsx = null;
    if (closable) {
      closeJsx = (
        <span className={`${prefixCls}-close-con`} onClick={onClose}>
          {closeText || <Icon className={`icon-close ${prefixCls}-close`} />}
        </span>
      );
    }
    return (
      <div className={`${prefixCls} ${type}-message`}>
        {showIcon && <Icon className={`${prefixCls}-icon ${typeIcon[type]}`} />}
        <div className={`${prefixCls}-msg-box`}>
          {message && <div className={`${prefixCls}-message`}>{message}</div>}
          {description && (
            <div className={`${prefixCls}-description`}>{description}</div>
          )}
        </div>
        {operation && (
          <div className={`${prefixCls}-operation`} onClick={operationClick}>
            {operation}
          </div>
        )}
        {closeJsx}
      </div>
    );
  }
}
Alert.TYPE = AlertType;
