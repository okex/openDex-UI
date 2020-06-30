/**
 * 单按钮弹框:操作弹框
 * Created by yuxin.zhang on 2018/1/1.
 */

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
    openWhen, visible, children,
    enterText, confirmText, btnDisabled,
    ...attr
  } = props;

  const dialogVisible = Object.prototype.hasOwnProperty.call(props, 'openWhen') ? openWhen : visible;

  const btnList = [
    {
      text: enterText || confirmText,
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

DialogOneBtn.propTypes = {
  /** 确认按钮文案，兼容之前版本不建议使用 */
  enterText: PropTypes.string,
  /** 确认按钮文案 */
  confirmText: PropTypes.string,
  /** 确认按钮禁止 */
  btnDisabled: PropTypes.bool,
  /** 确认按钮回调，兼容之前版本不建议使用 */
  onEnter: PropTypes.func,
  /** 取消按钮回调 */
  onConfirm: PropTypes.func,
};

DialogOneBtn.defaultProps = {
  enterText: '',
  confirmText: '',
  btnDisabled: false,
  onEnter: null,
  onConfirm: null,
};
