import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../IconLite';
import './index.less';

const typeIcon = {
  error: 'icon-close-circle',
  warn: 'icon-exclamation-circle',
  info: 'icon-info-circle',
  success: 'icon-check-circle'
};

const AlertType = {
  success: 'success',
  info: 'info',
  warn: 'warn',
  error: 'error'
};

const prefixCls = 'ok-ui-alert';

export default class Alert extends React.PureComponent {
  static propTypes = {
    /** 警告提示内容 */
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 警告提示的辅助性文字介绍 */
    description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 默认不显示关闭按钮 */
    closable: PropTypes.bool,
    /** 自定义关闭按钮 */
    closeText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 是否显示辅助图标 */
    showIcon: PropTypes.bool,
    // /** 自定义图标，showIcon 为 true 时有效 */
    // icon: PropTypes.string,
    /** 指定警告提示的样式，有四种选择，存在Alert.Type中的常量：success、info、warn、error   */
    type: PropTypes.string,
    /** 关闭时触发的回调函数 */
    onClose: PropTypes.func,
    /** 右侧操作文案 */
    operation: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 右侧操作点击事件 */
    operationClick: PropTypes.func,
    // /** 关闭动画结束后触发的回调函数 */
    // afterClose: PropTypes.func,
  };

  static defaultProps = {
    message: '',
    description: '',
    closable: true,
    closeText: '',
    showIcon: true,
    // icon: '',
    type: AlertType.info,
    onClose: null,
    operation: '',
    operationClick: null
    // afterClose: null,
  };

  render() {
    const {
      message, onClose, closable, type, description, closeText, showIcon,
      operation, operationClick
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
        {
          showIcon && <Icon className={`${prefixCls}-icon ${typeIcon[type]}`} />
        }
        <div className={`${prefixCls}-msg-box`}>
          {
            message && <div className={`${prefixCls}-message`}>{message}</div>
          }
          {
            description && <div className={`${prefixCls}-description`}>{description}</div>
          }
        </div>
        {
          operation && <div className={`${prefixCls}-operation`} onClick={operationClick}>{operation}</div>
        }
        {closeJsx}
      </div>);
  }
}
Alert.TYPE = AlertType;
