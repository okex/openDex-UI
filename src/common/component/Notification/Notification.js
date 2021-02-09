import React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TYPE from './TYPE';
import DIRECTION from './DIRECTION';
import './Notification.less';
import str from './str';
import { zIndexGenerator } from './zIndex';

const prefixCls = `okui-notification`;

// 当前展示中的Notification的列表
let notificationList = [];

let notificationCount = 0;

// 全局通用配置
let globalConfig = {
  top: 75,
  left: 20,
  right: 20,
  bottom: 20,
  placement: DIRECTION.topRight,
  duration: 300,
  maxCount: 10
};

// 从 notificationList 移除对应的Notification销毁方法和定时器ID
function removeNotificationFromList(id) {
  const newList = [];
  let aimItem = null;
  notificationList.forEach((item) => {
    if (item.notificationId === id) {
      aimItem = item;
    } else {
      newList.push(item);
    }
  });
  // 停止定时器
  aimItem && aimItem.destroyClockId && clearTimeout(aimItem.destroyClockId);
  // 从列表移除
  notificationList = newList;
  // 返回移除的项 可用于销毁
  return aimItem;
}


export default class Notification extends React.PureComponent {
  static propTypes = {
    /** 提示内容 */
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 描述内容 */
    desc: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 是否显示辅助图标 */
    showIcon: PropTypes.bool,
    /** iconfont class名 */
    icon: PropTypes.string,
    /** 是否显示关闭图标 */
    showClose: PropTypes.bool,
    /** 提示的样式，请从Notification.TYPE常量中选择：success、info、warn、error   */
    type: PropTypes.oneOf([TYPE.success, TYPE.info, TYPE.warn, TYPE.error]),
    /** 弹出位置 请从NotificationDIRECTION常量中选择 */
    // eslint-disable-next-line react/no-unused-prop-types
    placement: PropTypes.oneOf([DIRECTION.topLeft, DIRECTION.topRight, DIRECTION.bottomLeft, DIRECTION.bottomRight]),
    /** 自动关闭的延时，单位秒。设为 0 时不自动关闭。 */
    // eslint-disable-next-line react/no-unused-prop-types
    duration: PropTypes.number,
    /** 是否单行, 会影响操作按钮的布局 */
    isInline: PropTypes.bool,
    /** 关闭后触发的回调函数 */
    // eslint-disable-next-line react/no-unused-prop-types
    onClose: PropTypes.func,
    /** 操作按钮文案 */
    confirmText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 操作点击事件 */
    onConfirm: PropTypes.func,
    /** 次要操作按钮文案 */
    cancelText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 次要操作点击事件 */
    onCancel: PropTypes.func,
  };
  static defaultProps = {
    content: '',
    desc: '',
    showIcon: true,
    icon: '',
    showClose: true,
    type: TYPE.info,
    placement: globalConfig.placement,
    duration: globalConfig.duration,
    isInline: false,
    onClose: null,
    confirmText: '',
    onConfirm: undefined,
    cancelText: '',
    onCancel: undefined,
  };

  render() {
    const {
      showIcon, content, desc, type, showClose, isInline,
    } = this.props;
    return (
      <div className={`${prefixCls}-box ${type}`}>
        {
          showIcon &&
          <span className={`${prefixCls}-icon-circle ${type}`}></span>
        }
        {
          content && (
            <div className={`${prefixCls}-content ${isInline && `${prefixCls}-inline`}`}>
              <span className={`${prefixCls}-title`} title={content}>{content}</span>
              {desc && !isInline && <span className={`${prefixCls}-desc`}>{desc}</span>}
            </div>
          )
        }
        {
          showClose && <span className={`${prefixCls}-close`} onClick={this.props.destroy}>×</span>
        }
      </div>
    );
  }
}

function create(conf) {
  const {
    top,
    left,
    right,
    bottom,
  } = globalConfig;
  // 当前notification的唯一标志
  const notificationId = ++notificationCount;
  // 当前配置
  let currentConfig = conf;

  // 用于销毁的定时器的ID
  let destroyClockId = null;

  const currentPlacement = currentConfig.placement || globalConfig.placement;

  // 获取所有Notification的父容器
  let parentContainer = document.querySelector(`.${prefixCls}.${prefixCls}-${str.reverseCase(currentPlacement)}`);

  // 没有 则创建所有Notification的父容器
  if (!parentContainer) {
    parentContainer = document.createElement('div');
    parentContainer.className = `${prefixCls} ${prefixCls}-${str.reverseCase(currentPlacement)}`;
    parentContainer.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
    parentContainer.style.zIndex = zIndexGenerator.next(true).value;
    document.body.appendChild(parentContainer);
  }

  // 创建当前Notification的用于挂载的容器 并挂载到父容器
  const container = document.createElement('div');
  container.className = `${prefixCls}-container`;
  parentContainer.appendChild(container);

  function destroy() {
    // 已进入销毁流程 如果存在销毁定时 则清除定时器并从定时器列表中移除
    removeNotificationFromList(notificationId);

    // 添加移除动画
    container.className += ' container-remove';

    // 延时等动画完毕再移除
    setTimeout(() => {
      const unmountResult = ReactDOM.unmountComponentAtNode(container);
      if (unmountResult && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      if (conf.onClose) {
        conf.onClose();
      }
    }, 500);
  }

  function render(props) {
    ReactDOM.render(<Notification {...props} destroy={destroy} />, container);
  }

  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  render(currentConfig);

  // 有延时 延时自动关闭
  if (conf.duration !== 0) {
    destroyClockId = setTimeout(() => {
      destroy();
    }, Number(conf.duration || globalConfig.duration) * 1000);
  }

  // 将新Notification 存入列表
  notificationList.push({ notificationId, destroyClockId, destroy });

  // 如果数量多于10的时候 清除第一个
  if (notificationList.length >= globalConfig.maxCount) {
    const notification = removeNotificationFromList(notificationList[0].notificationId);
    notification.destroy();
  }

  return {
    destroy,
    update
  };
}

// 销毁所有显示的Notification
function destroyAll() {
  // 移除notification的根父容器
  const parentContainers = document.getElementsByClassName(prefixCls);
  if (parentContainers) {
    [...parentContainers].forEach((container) => {
      container.remove();
    });
  }
  // 清除所有定时器
  notificationList.forEach((item) => {
    clearTimeout(item.destroyClockId);
  });
  notificationList = [];
}

// 全局配置
function config(conf) {
  globalConfig = Object.assign(globalConfig, conf);
}

Notification.config = config;
Notification.create = create;
Notification.destroyAll = destroyAll;
Notification.TYPE = TYPE;
Notification.DIRECTION = DIRECTION;
