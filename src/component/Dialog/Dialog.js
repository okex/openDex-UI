import React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import BaseDialog from './BaseDialog';
import ActionButton from './ActionButton';
import './Dialog.less';

export default function Dialog(props) {
  const { openWhen, visible, children, btnList, onClose, ...attr } = props;
  const dialogVisible = Object.prototype.hasOwnProperty.call(props, 'openWhen')
    ? openWhen
    : visible;

  const {
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    confirmDisabled,
    confirmLoading,
    theme,
  } = props;

  const hasConfirmBtn = confirmText !== null && confirmText !== undefined;
  const hasCancelBtn = cancelText !== null && cancelText !== undefined;

  let newBtnList = [];
  hasCancelBtn &&
    newBtnList.push({
      text: cancelText,
      type: ActionButton.btnType.default,
      onClick: onCancel || onClose,
    });
  hasConfirmBtn &&
    newBtnList.push({
      text: confirmText,
      type: ActionButton.btnType.primary,
      onClick: onConfirm,
      loading: confirmLoading,
      disabled: confirmDisabled,
      closeDialog: onClose,
    });
  newBtnList = btnList && btnList.length !== 0 ? btnList : newBtnList || [];

  return (
    <BaseDialog {...attr} visible={dialogVisible} onClose={onClose}>
      {children}
      {newBtnList.length > 0 && (
        <div className="btn-box">
          {newBtnList.map((item, index) => {
            const {
              text,
              type,
              disabled,
              loading,
              onClick,
              closeDialog,
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
              >
                {text}
              </ActionButton>
            );
          })}
        </div>
      )}
    </BaseDialog>
  );
}

Dialog.defaultProps = {
  confirmText: null,
  cancelText: null,
  confirmDisabled: false,
  confirmLoading: false,
  onConfirm: null,
  onCancel: null,
};

Dialog.propTypes = {
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmDisabled: PropTypes.bool,
  confirmLoading: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

function create(config) {
  const div = document.createElement('div');

  let parentContainer = document.body;
  const { parentSelector } = config;

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
    ...config,
    visible: true,
    onClose: close,
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
    update,
  };
}

Dialog.create = create;
