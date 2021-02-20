import React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TYPE from './TYPE';
import DIRECTION from './DIRECTION';
import './Notification.less';
import str from './str';
import { zIndexGenerator } from './zIndex';

const prefixCls = `okui-notification`;

let notificationList = [];

let notificationCount = 0;

let globalConfig = {
  top: 75,
  left: 20,
  right: 20,
  bottom: 20,
  placement: DIRECTION.topRight,
  duration: 300,
  maxCount: 10
};

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
  aimItem && aimItem.destroyClockId && clearTimeout(aimItem.destroyClockId);
  notificationList = newList;
  return aimItem;
}


export default class Notification extends React.PureComponent {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    desc: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    showIcon: PropTypes.bool,
    icon: PropTypes.string,
    showClose: PropTypes.bool,
    type: PropTypes.oneOf([TYPE.success, TYPE.info, TYPE.warn, TYPE.error, TYPE.loading]),
    placement: PropTypes.oneOf([DIRECTION.topLeft, DIRECTION.topRight, DIRECTION.bottomLeft, DIRECTION.bottomRight]),
    duration: PropTypes.number,
    isInline: PropTypes.bool,
    onClose: PropTypes.func,
    confirmText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    onConfirm: PropTypes.func,
    cancelText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
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
  const notificationId = ++notificationCount;
  let currentConfig = conf;
  let destroyClockId = null;
  const currentPlacement = currentConfig.placement || globalConfig.placement;
  let parentContainer = document.querySelector(`.${prefixCls}.${prefixCls}-${str.reverseCase(currentPlacement)}`);
  if (!parentContainer) {
    parentContainer = document.createElement('div');
    parentContainer.className = `${prefixCls} ${prefixCls}-${str.reverseCase(currentPlacement)}`;
    parentContainer.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
    parentContainer.style.zIndex = zIndexGenerator.next(true).value;
    document.body.appendChild(parentContainer);
  }
  const container = document.createElement('div');
  container.className = `${prefixCls}-container`;
  parentContainer.appendChild(container);

  function destroy() {
    removeNotificationFromList(notificationId);

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

  if (conf.duration !== 0) {
    destroyClockId = setTimeout(() => {
      destroy();
    }, Number(conf.duration || globalConfig.duration) * 1000);
  }

  notificationList.push({ notificationId, destroyClockId, destroy });

  if (notificationList.length >= globalConfig.maxCount) {
    const notification = removeNotificationFromList(notificationList[0].notificationId);
    notification.destroy();
  }

  return {
    destroy,
    update
  };
}

function destroyAll() {
  const parentContainers = document.getElementsByClassName(prefixCls);
  if (parentContainers) {
    [...parentContainers].forEach((container) => {
      container.remove();
    });
  }
  notificationList.forEach((item) => {
    clearTimeout(item.destroyClockId);
  });
  notificationList = [];
}

function config(conf) {
  globalConfig = Object.assign(globalConfig, conf);
}

Notification.config = config;
Notification.create = create;
Notification.destroyAll = destroyAll;
Notification.TYPE = TYPE;
Notification.DIRECTION = DIRECTION;
