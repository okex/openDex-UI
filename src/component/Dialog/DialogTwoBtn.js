import React from 'react';
import PropTypes from 'prop-types';
import Dialog from './Dialog';
import './Dialog.less';
import ActionButton from './ActionButton';

export default function DialogTwoBtn(props) {
  function onConfirm() {
    if (props.onConfirm) {
      props.onConfirm();
    } else {
      props.onEnter && props.onEnter();
    }
  }

  function onCancel() {
    if (props.onCancel) {
      props.onCancel();
    } else {
      props.onClose && props.onClose();
    }
  }

  const {
    openWhen,
    visible,
    children,
    enterText,
    confirmText,
    cancelText,
    btnDisabled,
    ...attr
  } = props;

  const dialogVisible = Object.prototype.hasOwnProperty.call(props, 'openWhen')
    ? openWhen
    : visible;

  const btnList = [
    {
      text: cancelText,
      type: ActionButton.btnType.default,
      onClick: onCancel,
    },
    {
      text: confirmText || enterText,
      type: ActionButton.btnType.primary,
      onClick: onConfirm,
      disabled: btnDisabled,
    },
  ];
  return (
    <Dialog visible={dialogVisible} btnList={btnList} {...attr}>
      {children}
    </Dialog>
  );
}

DialogTwoBtn.propTypes = {
  enterText: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  btnDisabled: PropTypes.bool,
  onEnter: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

DialogTwoBtn.defaultProps = {
  enterText: '',
  confirmText: '',
  cancelText: '',
  btnDisabled: false,
  onEnter: null,
  onConfirm: null,
  onCancel: null,
};
