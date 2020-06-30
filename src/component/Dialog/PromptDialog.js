/**
 * 状态弹框
 * Created by yuxin.zhang on 2018/9/1.
 */

import React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Icon from '../IconLite';
import Dialog from './Dialog';
import './PromptDialog.less';

const typeIcon = {
  error: 'icon-close',
  warn: 'icon-exclamation',
  prompt: 'icon-remind',
  info: 'icon-info',
  success: 'icon-check'
};

const PromptDialogType = {
  confirm: 'confirm',
  prompt: 'prompt'
};

const PromptInfoType = {
  error: 'error',
  warn: 'warn',
  prompt: 'prompt',
  info: 'info',
  success: 'success'
};

export default class PromptDialog extends React.PureComponent {
  static propTypes = {
    /** 提示弹框的类型 可从 PromptDialog.dialogType枚举中选择：confirm:双按钮 prompt:单按钮 */
    dialogType: PropTypes.string,
    /** 提示弹信息的类型 PromptDialog.infoType枚举中选择: error:错误/失败 warn:警告 prompt:提示 info:说明 success:成功 */
    infoType: PropTypes.string,
    /** 标题 */
    title: PropTypes.string,
    /** 标题列表 适用于多行标题的情况 */
    titleList: PropTypes.array,
    /** 文案：标题下方解释说明性文字 */
    text: PropTypes.string,
    /** 文本列表 适用于多行文本的情况 */
    textList: PropTypes.array,
    /** 确认按钮文案 */
    confirmText: PropTypes.string,
    /** 确认按钮回调 */
    onConfirm: PropTypes.func,
    /** 取消按钮文案 dialogType=confirm 使用 */
    cancelText: PropTypes.string,
    /** 取消按钮回调  dialogType=confirm 使用 */
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    dialogType: PromptDialogType.prompt,
    infoType: PromptInfoType.prompt,
    title: '',
    titleList: [],
    text: '',
    textList: [],
    confirmText: '',
    cancelText: '',
    onConfirm: null,
    onCancel: null
  };

  onConfirm = () => {
    const { onConfirm } = this.props;
    return onConfirm && onConfirm();
  };

  onCancel = () => {
    const { onCancel, onClose } = this.props;
    if (onCancel) {
      return onCancel();
    }
    onClose && onClose();
    return null;
  };


  render() {
    const {
      dialogType, infoType, title, titleList, text, textList,
      cancelText,
      ...attr
    } = this.props;

    const newTitleList = title && title.length !== 0 ? [title] : titleList || [];
    const newTextList = text && text.length !== 0 ? [text] : textList || [];
    return (
      <Dialog
        {...attr}
        cancelText={dialogType === PromptDialog.dialogType.confirm ? cancelText : null}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
      >
        <div className="prompt-dialog-content">
          <div className={`icon-bg ${infoType}-bg`}>
            <Icon className={`prompt-icon ${typeIcon[infoType]}`} />
          </div>
          {
            newTitleList.map((item, index) => {
              return <div className="prompt-title" key={`tip_title${index}`}>{item}</div>;
            })
          }
          {
            newTextList.map((item, index) => {
              return <div className="prompt-text" key={`tip_text${index}`}>{item}</div>;
            })
          }
        </div>
      </Dialog>
    );
  }
}


function create(config) {
  const div = document.createElement('div');
  document.body.appendChild(div);

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

  function cancel() {
    destroy();
    if (config.onCancel) {
      config.onCancel();
    }
  }

  let currentConfig = {
    ...config, visible: true, onCancel: cancel, onClose: close
  };

  function render(props) {
    ReactDOM.render(<PromptDialog {...props} />, div);
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

PromptDialog.create = create;
PromptDialog.infoType = PromptInfoType;
PromptDialog.dialogType = PromptDialogType;

