import { commaLineBreak } from '_src/utils/ramda';
import LocalNodeActionType from '../actionTypes/LocalNodeActionType';

const electronUtils = window.require('electron').remote.require('./src/utils');

function getOkchaindDir() {
  const { store } = electronUtils;
  return store.get('okchaindDirectory');
}

function start(datadir, dispatch, getState) {
  const { shell } = electronUtils;
  const directory = getOkchaindDir();
  shell.cd(directory);
  const child = shell.exec(`./okchaind start --home ${datadir}`, { async: true });
  child.stdout.on('data', (data) => {
    const { logs } = getState().LocalNodeStore;
    const newLog = logs + data;
    dispatch({
      type: LocalNodeActionType.UPDATE_LOGS,
      data: newLog,
    });
    dispatch({
      type: LocalNodeActionType.UPDATE_OKCHAIND,
      data: child,
    });
  });
}

function isDirExist(dir) {
  const { shell } = electronUtils;
  return new Promise((resolve, reject) => {
    try {
      shell.exec(`cd ${dir}`, (code, stdout, stderr) => {
        if (code === 1) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

function baseDownload(dir, name, url) {
  const { BrowserWindow } = window.require('electron').remote;
  const win = BrowserWindow.getAllWindows()[0];
  const { download, emitter } = electronUtils;
  const directory = dir;
  return new Promise((resolve, reject) => {
    try {
      const trigger = download(name, resolve);
      trigger(win, url, {
        directory,
        // onProgress: genDownloadProgressHandler(name, resolve)
      });
    } catch (err) {
      console.log('doDownload error：', err);
      reject(err);
      emitter.emit(`downloadError@${name}`, err);
    }
  });
}

function downloadGenesis(datadir) {
  const { shell } = electronUtils;
  shell.cd(datadir);
  shell.exec('rm -rf genesis.json');
  return baseDownload(datadir, 'genesis', 'https://raw.githubusercontent.com/okex/testnets/master/latest/genesis.json');
}

function downloadSeeds(datadir) {
  return baseDownload(datadir, 'seeds', 'https://raw.githubusercontent.com/okex/testnets/master/latest/seeds.txt');
}

function setSeeds(configDir) {
  const { shell } = electronUtils;
  return new Promise((resolve, reject) => {
    try {
      shell.cd(configDir);
      shell.exec('cat seeds.txt', (code, stdout, stderr) => {
        const seeds = commaLineBreak(stdout).replace(/,$/, '');
        shell.exec(`sed -i.bak 's/seeds = ""/seeds = "${seeds}"/g' config.toml`);
        resolve(true);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function initData(datadir) {
  const { shell } = electronUtils;
  const okchaindDir = getOkchaindDir();
  return new Promise((resolve, reject) => {
    try {
      shell.cd(okchaindDir);
      shell.exec(`./okchaind init desktop --home ${datadir}`, (code, stdout, stderr) => {
        resolve(true);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export function updateLogs(logs) {
  return (dispatch) => {
    dispatch({
      type: LocalNodeActionType.UPDATE_LOGS,
      data: logs,
    });
  };
}

export function initOkchaind(datadir) {
  return async (dispatch, getState) => {
    const isExist = await isDirExist(datadir);
    const configDir = `${datadir}/config`;
    if (isExist) {
      start(datadir, dispatch, getState);
    } else {
      await initData(datadir);
      await downloadGenesis(configDir);
      await downloadSeeds(configDir);
      await setSeeds(configDir);
      start(datadir, dispatch, getState);
    }
  };
}

export function stopOkchaind() {
  return (dispatch) => {
    const okchaindDir = getOkchaindDir();
    const { shell } = electronUtils;
    shell.cd(okchaindDir);
    shell.exec('./okchaind stop', (code, stdout, stderr) => {
      if (code === 0) {
        dispatch({
          type: LocalNodeActionType.UPDATE_OKCHAIND,
          data: null,
        });
      }
    });
  };
}

export function switchIsStarted(status) {
  return (dispatch) => {
    dispatch({
      type: LocalNodeActionType.UPDATE_IS_STARTED,
      data: status,
    });
  };
}

