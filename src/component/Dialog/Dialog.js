/**
 * 基础弹框
 * Created by yuxin.zhang on 2018/9/1.
 */

import React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import BaseDialog from './BaseDialog';
import ActionButton from './ActionButton';
import './Dialog.less';

export default function Dialog(props) {
  const {
    openWhen, visible, children, btnList, onClose,
    ...attr
  } = props;
  const dialogVisible = Object.prototype.hasOwnProperty.call(props, 'openWhen') ? openWhen : visible;

  const {
    confirmText, cancelText, onConfirm, onCancel, confirmDisabled, confirmLoading, theme
  } = props;

  // 当存在对应的按钮文案时，会显示对应的按钮
  const hasConfirmBtn = confirmText !== null && confirmText !== undefined;
  const hasCancelBtn = cancelText !== null && cancelText !== undefined;

  let newBtnList = [];
  hasCancelBtn && newBtnList.push({
    text: cancelText,
    type: ActionButton.btnType.default,
    onClick: onCancel || onClose
  });
  hasConfirmBtn && newBtnList.push({
    text: confirmText,
    type: ActionButton.btnType.primary,
    onClick: onConfirm,
    loading: confirmLoading,
    disabled: confirmDisabled,
    closeDialog: onClose,
  });
  // 当外部没有按钮列表时  使用内部列表
  newBtnList = btnList && btnList.length !== 0 ? btnList : newBtnList || [];

  return (
    <BaseDialog
      {...attr}
      visible={dialogVisible}
      onClose={onClose}
    >
      {children}
      {
        newBtnList.length > 0 &&
        <div className="btn-box">
          {
            newBtnList.map((item, index) => {
              const {
                text, type, disabled, loading, onClick, closeDialog
              } = item;
              return (
                <ActionButton
                  key={`dialogBtn${index}`}
                  type={type}
                  disabled={disabled}
                  className="dialog-btn"
                  loading={loading}
                  onClick={onClick}
                  closeDialog={closeDialog}
                  theme={theme}
                >{text}
                </ActionButton>
              );
            })
          }
        </div>
      }
    </BaseDialog>
  );
}

Dialog.defaultProps = {
  confirmText: null,
  cancelText: null,
  confirmDisabled: false,
  confirmLoading: false,
  onConfirm: null,
  onCancel: null
};

Dialog.propTypes = {
  /** 确认按钮文案  当该参数不为 null/undefined 时，会出现确认按钮 */
  confirmText: PropTypes.string,
  /** 取消按钮文案 当该参数不为 null/undefined 时，会出现取消按钮 */
  cancelText: PropTypes.string,
  /** 确认按钮禁止 */
  confirmDisabled: PropTypes.bool,
  /** 确认按钮loading */
  confirmLoading: PropTypes.bool,
  /** 确认按钮回调 */
  onConfirm: PropTypes.func,
  /** 取消按钮回调 可以不传 不传时会调用onClose */
  onCancel: PropTypes.func
};


function create(config) {
  const div = document.createElement('div');

  let parentContainer = document.body;
  const { parentSelector } = config;

  // 如果 指定了父容器且存在 则挂载到父容器上 默认挂载到body
  if (parentSelector && document.querySelector(parentSelector)) {
    parentContainer = document.querySelector(parentSelector);
  }
  parentContainer.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function close() {
    destroy();
    if (config.onClose) {
      config.onClose();
    }
  }

  let currentConfig = {
    ...config, visible: true, onClose: close
  };

  function render(props) {
    ReactDOM.render(<Dialog {...props} />, div);
  }

  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  render(currentConfig);

  return {
    destroy,
    update
  };
}

Dialog.create = create;
