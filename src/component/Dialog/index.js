/**
 * 弹框
 * Created by yuxin.zhang on 2018/1/1.
 */

import Dialog from './Dialog';
import DialogOneBtn from './DialogOneBtn';
import DialogTwoBtn from './DialogTwoBtn';
import PromptDialog from './PromptDialog';

function createFunction(type) {
  return (props) => {
    const config = {
      dialogType: PromptDialog.dialogType.prompt,
      infoType: PromptDialog.infoType[type],
      ...props,
    };
    return PromptDialog.create(config);
  };
}

// 完全一个数组遍历来写，只不过用的时候就没有提示了
Dialog.success = createFunction(PromptDialog.infoType.success);
Dialog.info = createFunction(PromptDialog.infoType.info);
Dialog.prompt = createFunction(PromptDialog.infoType.prompt);
Dialog.warn = createFunction(PromptDialog.infoType.warn);
Dialog.error = createFunction(PromptDialog.infoType.error);

Dialog.confirm = (props) => {
  const config = {
    dialogType: PromptDialog.dialogType.confirm,
    infoType: PromptDialog.infoType.warn,
    ...props,
  };
  return PromptDialog.create(config);
};

Dialog.show = (props) => {
  return Dialog.create(props);
};


export { Dialog, DialogOneBtn, DialogTwoBtn, PromptDialog };
