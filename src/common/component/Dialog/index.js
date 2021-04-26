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

Dialog.show = (props) => Dialog.create(props);

export { Dialog, DialogOneBtn, DialogTwoBtn, PromptDialog };
