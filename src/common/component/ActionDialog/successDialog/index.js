import { Dialog } from '_component/Dialog';
import Config from '_constants/Config';

const showSuccessDialog = (title, txhash) => {
  const dialog = Dialog.success({
    className: 'desktop-success-dialog',
    confirmText: 'Get Detail',
    theme: 'dark',
    title,
    windowStyle: {
      background: '#112F62',
    },
    onConfirm: () => {
      window.open(`${Config.okexchain.browserUrl}/tx/${txhash}`);
      dialog.destroy();
    },
  });
};

export default showSuccessDialog;
