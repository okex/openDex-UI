import React from 'react';
import PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import Icon from '../IconLite';
import './Message.less';

const prefixCls = 'ok-ui-message';

// Message 类型
const MessageType = {
  success: 'success',
  info: 'info',
  warn: 'warn',
  error: 'error',
  loading: 'loading',
};

// 类型对应图标
const typeIcon = {
  error: 'icon-close-circle',
  warn: 'icon-exclamation-circle',
  info: 'icon-info-circle',
  success: 'icon-check-circle',
  loading: 'icon-Loading',
};

// 当前展示中的Message的列表
let messageList = [];

let messageCount = 0;

// 全局通用配置
let globalConfig = {
  top: 16,
  duration: 3,
  maxCount: 10
};

// 从 messageList 移除对应的Message销毁方法和定时器ID
function removeMessageFromList(id) {
  const newList = [];
  let aimItem = null;
  messageList.forEach((item) => {
    if (item.messageId === id) {
      aimItem = item;
    } else {
      newList.push(item);
    }
  });
  // 停止定时器
  aimItem && aimItem.destroyClockId && clearTimeout(aimItem.destroyClockId);
  // 从列表移除
  messageList = newList;
  // 返回移除的项 可用于销毁
  return aimItem;
}


export default class Message extends React.PureComponent {
  static propTypes = {
    /** 提示内容 */
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 是否显示辅助图标 */
    showIcon: PropTypes.bool,
    /** 提示的样式，有四种选择，存在Message.Type中的常量：success、info、warn、error、loading   */
    type: PropTypes.string,
    /** 自动关闭的延时，单位秒。设为 0 时不自动关闭。 */
    duration: PropTypes.number,
    /** 关闭后触发的回调函数 */
    onClose: PropTypes.func,
  };

  static defaultProps = {
    content: '',
    showIcon: true,
    type: MessageType.info,
    duration: 3,
    onClose: null,
  };

  render() {
    const { showIcon, content, type } = this.props;
    return (
      <div className={`${prefixCls}-box`}>
        {
          showIcon && <Icon className={`${prefixCls}-icon ${typeIcon[type]} ${type}`} />
        }
        {
          content && <span className={`${prefixCls}-text`}>{content}</span>
        }
      </div>
    );
  }
}

function create(conf) {
  // 当前message的唯一标志
  const messageId = ++messageCount;
  // 当前配置
  let currentConfig = conf;

  // 用于销毁的定时器的ID
  let destroyClockId = null;

  // 获取所有Message的父容器
  let parentContainer = document.getElementsByClassName(prefixCls)[0];

  // 没有 则创建所有Message的父容器
  if (!parentContainer) {
    parentContainer = document.createElement('div');
    parentContainer.className = prefixCls;
    // 设置据顶端的高度
    parentContainer.style.top = globalConfig.top;
    document.body.appendChild(parentContainer);
  }

  // 创建当前Message的用于挂载的容器 并挂载到父容器
  const container = document.createElement('div');
  container.className = `${prefixCls}-container`;
  parentContainer.appendChild(container);

  function destroy() {
    // 已进入销毁流程 如果存在销毁定时 则清除定时器并从定时器列表中移除
    removeMessageFromList(messageId);

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
    ReactDOM.render(<Message {...props} />, container);
  }

  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  render(currentConfig);

  // 有延时 怎延时自动关闭
  if (conf.duration !== 0) {
    destroyClockId = setTimeout(() => {
      destroy();
    }, Number(conf.duration || globalConfig.duration) * 1000);
  }

  // 将新Message 存入列表
  messageList.push({ messageId, destroyClockId, destroy });

  // 如果数量多于10的时候 清除第一个
  if (messageList.length >= globalConfig.maxCount) {
    const message = removeMessageFromList(messageList[0].messageId);
    message.destroy();
  }

  return {
    destroy,
    update
  };
}

// 销毁所有显示的Message
function destroyAll() {
  // 移除message的根父容器
  const parentContainer = document.getElementsByClassName(prefixCls)[0];
  parentContainer && parentContainer.parentNode.removeChild(parentContainer);
  // 清除所有定时器
  messageList.forEach((item) => {
    clearTimeout(item.destroyClockId);
  });
  messageList = [];
}

// 全局配置
function config(conf) {
  globalConfig = Object.assign(globalConfig, conf);
}

Message.config = config;
Message.create = create;
Message.destroyAll = destroyAll;
Message.TYPE = MessageType;
