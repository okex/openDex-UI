import React from 'react';
import PropTypes from 'prop-types';
import Dialog from './Dialog';
import ActionButton from './ActionButton';
import './Dialog.less';

export default function DialogOneBtn(props) {
  function onConfirm() {
    props.onEnter && props.onEnter();
    props.onConfirm && props.onConfirm();
  }

  const {
    openWhen,
    visible,
    children,
    enterText,
    confirmText,
    btnDisabled,
    ...attr
  } = props;

  const dialogVisible = Object.prototype.hasOwnProperty.call(props, 'openWhen')
    ? openWhen
    : visible;

  const btnList = [
    {
      text: enterText || confirmText,
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

DialogOneBtn.propTypes = {
  enterText: PropTypes.string,
  confirmText: PropTypes.string,
  btnDisabled: PropTypes.bool,
  onEnter: PropTypes.func,
  onConfirm: PropTypes.func,
};

DialogOneBtn.defaultProps = {
  enterText: '',
  confirmText: '',
  btnDisabled: false,
  onEnter: null,
  onConfirm: null,
};
