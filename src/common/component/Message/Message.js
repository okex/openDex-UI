import React from 'react';
import PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import Icon from '../IconLite';
import './Message.less';

const prefixCls = 'ok-ui-message';

const MessageType = {
  success: 'success',
  info: 'info',
  warn: 'warn',
  error: 'error',
  loading: 'loading',
};

const typeIcon = {
  error: 'icon-close-circle',
  warn: 'icon-exclamation-circle',
  info: 'icon-info-circle',
  success: 'icon-check-circle',
  loading: 'icon-Loading',
};

let messageList = [];

let messageCount = 0;

let globalConfig = {
  top: 16,
  duration: 3,
  maxCount: 10,
};

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
  aimItem && aimItem.destroyClockId && clearTimeout(aimItem.destroyClockId);
  messageList = newList;
  return aimItem;
}

export default class Message extends React.PureComponent {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    showIcon: PropTypes.bool,
    type: PropTypes.string,
    duration: PropTypes.number,
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
        {showIcon && (
          <Icon className={`${prefixCls}-icon ${typeIcon[type]} ${type}`} />
        )}
        {content && <span className={`${prefixCls}-text`}>{content}</span>}
      </div>
    );
  }
}

function create(conf) {
  const messageId = ++messageCount;
  let currentConfig = conf;

  let destroyClockId = null;

  let parentContainer = document.getElementsByClassName(prefixCls)[0];

  if (!parentContainer) {
    parentContainer = document.createElement('div');
    parentContainer.className = prefixCls;
    parentContainer.style.top = globalConfig.top;
    document.body.appendChild(parentContainer);
  }

  const container = document.createElement('div');
  container.className = `${prefixCls}-container`;
  parentContainer.appendChild(container);

  function destroy() {
    removeMessageFromList(messageId);

    container.className += ' container-remove';

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

  if (conf.duration !== 0) {
    destroyClockId = setTimeout(() => {
      destroy();
    }, Number(conf.duration || globalConfig.duration) * 1000);
  }

  messageList.push({ messageId, destroyClockId, destroy });

  if (messageList.length >= globalConfig.maxCount) {
    const message = removeMessageFromList(messageList[0].messageId);
    message.destroy();
  }

  return {
    destroy,
    update,
  };
}

function destroyAll() {
  const parentContainer = document.getElementsByClassName(prefixCls)[0];
  parentContainer && parentContainer.parentNode.removeChild(parentContainer);
  messageList.forEach((item) => {
    clearTimeout(item.destroyClockId);
  });
  messageList = [];
}

function config(conf) {
  globalConfig = Object.assign(globalConfig, conf);
}

Message.config = config;
Message.create = create;
Message.destroyAll = destroyAll;
Message.TYPE = MessageType;
