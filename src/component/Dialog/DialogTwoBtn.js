/**
 * 双按钮弹框:确认／警告弹框
 * Created by yuxin.zhang on 2018/1/1.
 */

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
    openWhen, visible, children,
    enterText, confirmText, cancelText, btnDisabled,
    ...attr
  } = props;

  const dialogVisible = Object.prototype.hasOwnProperty.call(props, 'openWhen') ? openWhen : visible;

  const btnList = [
    {
      text: cancelText,
      type: ActionButton.btnType.default,
      onClick: onCancel
    },
    {
      text: confirmText || enterText,
      type: ActionButton.btnType.primary,
      onClick: onConfirm,
      disabled: btnDisabled
    }
  ];
  return (

    <Dialog
      visible={dialogVisible}
      btnList={btnList}
      {...attr}
    >
      {children}
    </Dialog>
  );
}

DialogTwoBtn.propTypes = {
  /** 确认按钮文案，兼容之前版本不建议使用 */
  enterText: PropTypes.string,
  /** 确认按钮文案 */
  confirmText: PropTypes.string,
  /** 取消按钮文案 */
  cancelText: PropTypes.string,
  /** 确认按钮禁止 */
  btnDisabled: PropTypes.bool,
  /** 确认按钮回调，兼容之前版本不建议使用 */
  onEnter: PropTypes.func,
  /** 确认按钮回调 */
  onConfirm: PropTypes.func,
  /** 取消按钮回调 */
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
