import React from 'react';
import { Dialog } from '_component/Dialog';
import { Circle } from 'rc-progress';
import { calc } from '_component/okit';

import './index.less';

const electronUtils = window.require('electron').remote.require('./src/utils');
const { emitter, store } = electronUtils;
let dialog;

const Process = ({ percent = 0, text }) => (
  <div className="status">
    <div className="progress">
      <div className="percent-text">{percent}%</div>
      <Circle percent={percent} strokeWidth="6" trailWidth="6" strokeColor="#2EAD65" /> 
    </div>
    {text}
  </div>
);

const DownResult = ({ text }) => (
  <div className="success">
    <div className="icon">

    </div>
    {text}
  </div>
);

const dialogConfig = {
  install: {
    install: {
      className: 'download-dialog',
      title: 'Install Local node',
      children: (
        <div className="install">
          <p>Now you could install your own OKExChain node locally.</p>
          <p>Hardware requirement: CPU 4 core</p>
        </div>
      ),
      cancelText: 'Cancel',
      confirmText: 'Install',
      hideCloseBtn: false
    },
    downloading: {
      className: 'status-dialog',
      title: undefined,
      children: <Process percent={0} text="installing..." />,
      cancelText: undefined,
      confirmText: undefined,
      // hideCloseBtn: true
    },
    success: {
      className: 'success-dialog',
      title: undefined,
      children: <DownResult text="Installed successfully！" />,
      cancelText: undefined,
      confirmText: 'GO Checked',
    },
    fail: {
      className: 'fail-dialog',
      title: undefined,
      children: <DownResult text="Installed failed." />,
      cancelText: 'Cancel',
      confirmText: 'Try Again',
    }
  }
}

let isEmitterInit = false;

const onDownloadAndUpdate = () => {
  let option;
  let isFinish = false;
  let config = {};
  const okchaindObj = store.get('okchaindObj');
  const cliObj = store.get('cliObj');
  const processTotal = okchaindObj.size + cliObj.size; // 2 assets will be download
  const transferredBytesMap = {
    okchaind: 0,
    okchaincli: 0
  };

  const updateDialog = (option) => {
    if (dialog) {
      dialog.update(option);
    } else {
      dialog = Dialog.show(option);
    }
  };

  const setInstallDialog = () => {
    option = config.install;
    option.onConfirm = () => {
      setDownloadingDialog('okchaind');
      emitter.emit('downloadOkchaind@download'); // trigger okchaind download
    }
    updateDialog(option);
  }

  const setDownloadingDialog = (name = 'okchaind', transferredBytes) => {
    option = config.downloading;
    const updateProcessDialog = () => {
      transferredBytesMap[name] = transferredBytes;
      const { okchaind = 0, okchaincli = 0 } = transferredBytesMap;
      const ratio = calc.div(okchaind + okchaincli, processTotal);

      const percent = calc.truncate(ratio * 100, 1);
      option.children = <Process percent={percent} text="installing..." />
      updateDialog(option);
    };

    updateProcessDialog();
  }

  const setSuceesDialog = () => {
    console.log('setSuceesDialog');
    isFinish = true;
    option = config.success;
    option.onConfirm = () => dialog.destroy();
    updateDialog(option);
  }

  const setFailDialog = () => {
    isFinish = true;
    console.log('setFailDialog')
    option = config.fail;
    option.onConfirm = () => {
      isFinish = false;
      // reset download process
      transferredBytesMap.okchaind = 0;
      transferredBytesMap.okchaincli = 0;

      emitter.emit('redownload');
      emitter.emit('downloadOkchaind@download'); // trigger okchaind download
    };
    updateDialog(option);
  }

  const initEmitter = () => {
    if (!isEmitterInit) {
      emitter.on('notDownload@Download', data => {
        config = dialogConfig.install;
        if(data.isRedownload) {
          setDownloadingDialog();
        } else {
          setInstallDialog();
        }
      });

      emitter.on('newVersionFound@download', data => {
        config = dialogConfig.update;
        if(data.isRedownload) {
          setDownloadingDialog();
        } else {
          setInstallDialog();
        }
      })

      emitter.emit('windowReadyReceiveEvent');

      emitter.on('downloadProgress@okchaind', data => {
        setDownloadingDialog('okchaind', data.transferredBytes || 0);
      });
  
      emitter.on('downloadProgress@okchaincli', data => {
        if (!isFinish) {
          setDownloadingDialog('okchaincli', data.transferredBytes || 0);
        }
      })
  
      emitter.on('downloadFinish@okchaind', () => {
        emitter.emit('downloadOkchaincli@download'); // electron-dl bug on process, can not parallel download
      });
      
      emitter.on('downloadFinish@okchaincli', () => {
        setSuceesDialog();
      });
  
      emitter.on('downloadError', () => {
        setFailDialog();
      });
      isEmitterInit = true;
    }
  };

  initEmitter();
}

const downloadDialog = () => {
  if (!isEmitterInit) {
    onDownloadAndUpdate();
  }
  return dialog;
}

export default downloadDialog;