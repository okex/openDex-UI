/**
 * 弹框-基础层
 * Created by yuxin.zhang on 2018/9/1.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Loading from '../Loading';
import './Dialog.less';


/**
 * 拖拽
 * @param currentDialogId 可以拖拽的元素的id
 */
function dragFunc(currentDialogId) {
  const titleDiv = document.getElementById(currentDialogId);
  if (!titleDiv) {
    return false;
  }
  const dialog = titleDiv.parentNode;
  titleDiv.onmousedown = (ev) => {
    const oEvent = ev || window.event;

    const distanceX = oEvent.clientX - dialog.offsetLeft;
    const distanceY = oEvent.clientY - dialog.offsetTop;

    document.onmousemove = (ev1) => {
      const oEvent1 = ev1 || window.event;
      dialog.style.left = `${oEvent1.clientX - distanceX}px`;
      dialog.style.top = `${oEvent1.clientY - distanceY}px`;
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
    oEvent.cancelBubble = true;
    oEvent.stopPropagation();
  };
  return true;
}

export default class BaseDialog extends React.PureComponent {
  static propTypes = {
    /** 弹框是否可见 */
    visible: PropTypes.bool,
    /** 是否展示加载状态 */
    showLoading: PropTypes.bool,
    /** 隐藏关闭按钮 */
    hideCloseBtn: PropTypes.bool,
    /** 自定义关闭按钮 */
    closeBtn: PropTypes.any,
    /** 标题 */
    title: PropTypes.string,
    /** 关闭回调 */
    onClose: PropTypes.func,
    /** 主题 目前只支持dark 用于夜间模式 */
    theme: PropTypes.string,
    /** 是否可拖拽 */
    canDrag: PropTypes.bool,
    /** 弹框Id 可拖拽必传 */
    dialogId: PropTypes.string,
    /** 设置 Dialog 的 z-index */
    zIndex: PropTypes.number,
    /** 指定宽度 默认无 一般情况应该根据内容撑宽 而不是指定宽度 */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** 里层window样式 即弹框体 */
    windowStyle: PropTypes.object,
    /** 是否显示蒙层 */
    mask: PropTypes.bool,
    /** 点击蒙层是否允许关闭 */
    maskClosable: PropTypes.bool,
    /** 遮罩蒙层样式 */
    maskStyle: PropTypes.object,
  };

  static defaultProps = {
    visible: false,
    showLoading: false,
    hideCloseBtn: false,
    closeBtn: null,
    canDrag: false,
    title: '',
    theme: '',
    dialogId: '',
    onClose: null,
    zIndex: undefined,
    width: null,
    windowStyle: {},
    mask: true,
    maskClosable: false,
    maskStyle: {},
  };

  state = {
    dragInitialized: false
  };

  componentDidMount() {
    const { visible, canDrag, dialogId } = this.props;
    if (visible && canDrag) {
      this.state.dragInitialized = dragFunc(dialogId);
    }
  }


  componentDidUpdate() {
    const { visible, canDrag, dialogId } = this.props;
    if (visible && canDrag) {
      this.state.dragInitialized = dragFunc(dialogId);
    }
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose && onClose();
  };

  render() {
    const {
      visible, showLoading, hideCloseBtn, canDrag, children,
      title, dialogId, theme, zIndex, width, closeBtn,
      mask, maskClosable, maskStyle, className
    } = this.props;
    const dialogStyle = zIndex ? { zIndex } : {};
    const windowStyle = { ...(width ? { width } : {}), ...this.props.windowStyle };
    return (
      visible &&
      <div
        className={
          classNames(
            'ok-dialog',
            { [theme]: theme },
            { 'dialog-show': visible },
            { 'dialog-hide': !visible },
            className
          )
        }
        style={dialogStyle}
      >
        {/* 蒙层 */}
        <div
          className={
            classNames(
              'ok-dialog-mask',
              { 'mask-hide': !mask },
            )
          }
          onClick={maskClosable ? this.onClose : null}
          style={maskStyle || {}}
        />
        {/* 弹框体 */}
        <div className="dialog-window" style={windowStyle}>
          <div className={`dialog-top ${title.length === 0 ? 'no-title-bottom-line' : ''} ${canDrag ? 'drag' : ''}`} id={dialogId}>
            <span className="dialog-title">{title}</span>
            {
              !hideCloseBtn && (closeBtn === null ? <span className="close-btn" onClick={this.onClose}>×</span> : <span onClick={this.onClose}>{closeBtn}</span>)
            }
          </div>
          <div className={`dialog-box ${(!title || title.length === 0) ? 'no-title' : ''}`}>
            {children}
            <Loading when={showLoading} theme={theme} />
          </div>
        </div>
      </div>
    );
  }
}

