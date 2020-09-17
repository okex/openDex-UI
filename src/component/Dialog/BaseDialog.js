import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Loading from '../Loading';
import './Dialog.less';

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
    visible: PropTypes.bool,
    showLoading: PropTypes.bool,
    hideCloseBtn: PropTypes.bool,
    closeBtn: PropTypes.any,
    title: PropTypes.string,
    onClose: PropTypes.func,
    theme: PropTypes.string,
    canDrag: PropTypes.bool,
    dialogId: PropTypes.string,
    zIndex: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    windowStyle: PropTypes.object,
    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
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
    dragInitialized: false,
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
      visible,
      showLoading,
      hideCloseBtn,
      canDrag,
      children,
      title,
      dialogId,
      theme,
      zIndex,
      width,
      closeBtn,
      mask,
      maskClosable,
      maskStyle,
      className,
    } = this.props;
    const dialogStyle = zIndex ? { zIndex } : {};
    const windowStyle = {
      ...(width ? { width } : {}),
      ...this.props.windowStyle,
    };
    return (
      visible && (
        <div
          className={classNames(
            'ok-dialog',
            { [theme]: theme },
            { 'dialog-show': visible },
            { 'dialog-hide': !visible },
            className
          )}
          style={dialogStyle}
        >
          <div
            className={classNames('ok-dialog-mask', { 'mask-hide': !mask })}
            onClick={maskClosable ? this.onClose : null}
            style={maskStyle || {}}
          />
          <div className="dialog-window" style={windowStyle}>
            <div
              className={`dialog-top ${
                title.length === 0 ? 'no-title-bottom-line' : ''
              } ${canDrag ? 'drag' : ''}`}
              id={dialogId}
            >
              <span className="dialog-title">{title}</span>
              {!hideCloseBtn &&
                (closeBtn === null ? (
                  <span className="close-btn" onClick={this.onClose}>
                    ×
                  </span>
                ) : (
                  <span onClick={this.onClose}>{closeBtn}</span>
                ))}
            </div>
            <div
              className={`dialog-box ${
                !title || title.length === 0 ? 'no-title' : ''
              }`}
            >
              {children}
              <Loading when={showLoading} theme={theme} />
            </div>
          </div>
        </div>
      )
    );
  }
}
