import ont from '_src/utils/dataProxy';
import { commaLineBreak, divide, multiply } from '_src/utils/ramda';
import Message from '_src/component/Message';
import { NODE_TYPE } from '_constants/Node';
import { LOCAL_PREFIX } from '_constants/apiConfig';
import { getStartCommand } from '_src/utils/command';
import LocalNodeActionType from '../actionTypes/LocalNodeActionType';
import NodeActionType from '../actionTypes/NodeActionType';
import downloadDialog from '_app/pages/fullTrade/DownloadDialog';
import { htmlLineBreak } from '_src/utils/ramda';

const electronUtils = window.require('electron').remote.require('./src/utils');

let timer = null;
const pollInterval = 3000;
let breakTimer = null;
let tempBreakTimer = null;

function getOkexchaindDir() {
  const { store } = electronUtils;
  return store.get('okexchaindDirectory');
}

function stopPoll() {
  timer && clearInterval(timer);
  tempBreakTimer && clearInterval(tempBreakTimer);
}

function getListenClient() {
  if (!getListenClient.instance) getListenClient.instance = listenClient();
  return getListenClient.instance;
}

function start(datadir, dispatch, getState, func, terminal = false) {
  const { shell, localNodeServerClient, localNodeDataStatus } = electronUtils;
  const directory = getOkexchaindDir();
  return new Promise((reslove, reject) => {
    try {
      if (!localNodeDataStatus.checkOKExchain(true)) {
        downloadDialog(true);
        reject();
        return;
      }
      shell.cd(directory);
      const { p2p, ws, rest, db } = getState().LocalNodeStore;
      const startCommand = getStartCommand({
        p2p,
        ws,
        rest,
        datadir,
        db,
      });
      const child =
        localNodeServerClient.get() ||
        shell.exec(`${startCommand}`, { async: true }, (code) => {
          console.log('start code:' + code);
          if (code !== 130 && code !== 0 && code !== 2) {
            Message.error({
              content: 'okexchaind start error',
            });
            stopPoll();
            dispatch({
              type: LocalNodeActionType.UPDATE_IS_STARTED,
              data: false,
            });
            dispatch({
              type: LocalNodeActionType.UPDATE_DATADIR_AT_START,
              data: '',
            });
            localNodeServerClient.set(null);
            if (terminal) getListenClient().stop();
          }
        });
      dispatch({
        type: LocalNodeActionType.UPDATE_DATADIR_AT_START,
        data: datadir,
      });
      localNodeServerClient.set(child);
      if (typeof func === 'function') func();
      if (terminal) getListenClient().start();
      reslove(true);
    } catch (err) {
      reject(err);
    }
  });
}

function listenClient() {
  const { localNodeServerClient } = electronUtils;
  let logs = [],
    interval = null;
  const MAXLOGCOUNT = 20;
  function getData(data) {
    const temp = htmlLineBreak(data);
    if (logs.length >= MAXLOGCOUNT) logs.shift();
    logs.push(temp);
  }

  function outData(start = true) {
    if (start && !interval) {
      interval = setInterval(() => {
        const terminalDom = document.getElementById('local-terminal-content');
        if (terminalDom) {
          terminalDom.innerHTML = logs.join();
        }
      }, 50);
    } else if (!start && interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  return {
    getChild() {
      return localNodeServerClient.get();
    },
    start() {
      const child = this.getChild();
      if (!child) return;
      child.stdout.on('data', getData);
      outData();
    },
    stop() {
      const child = this.getChild();
      if (!child) return;
      child.stdout.off('data', getData);
      outData(false);
    },
  };
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
  return baseDownload(
    datadir,
    'genesis',
    'https://raw.githubusercontent.com/okex/testnets/master/latest/genesis.json'
  );
}

function downloadSeeds(datadir) {
  return baseDownload(
    datadir,
    'seeds',
    'https://raw.githubusercontent.com/okex/testnets/master/latest/seeds.txt'
  );
}

function setSeeds(configDir) {
  const { shell } = electronUtils;
  return new Promise((resolve, reject) => {
    try {
      shell.cd(configDir);
      shell.exec('cat seeds.txt', (code, stdout, stderr) => {
        const seeds = commaLineBreak(stdout).replace(/,$/, '');
        shell.exec(
          `sed -i.bak 's/seeds = ""/seeds = "${seeds}"/g' config.toml`
        );
        resolve(true);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function initData(datadir) {
  const { shell } = electronUtils;
  const okexchaindDir = getOkexchaindDir();
  return new Promise((resolve, reject) => {
    try {
      shell.cd(okexchaindDir);
      shell.exec(
        `./okexchaind init desktop --home ${datadir}`,
        (code, stdout, stderr) => {
          resolve(true);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

function updateEstimatedTime(dispatch, getState, info, diffLocalHeight) {
  const masterHeight = getState().Common.latestHeight;
  const localHeight = info.latest_block_height;
  const diffHeight = masterHeight - localHeight;
  let time;
  if (diffHeight === 0 || diffLocalHeight === 0) {
    time = 0;
  } else {
    const t = divide(pollInterval, diffLocalHeight);
    time = multiply(t, diffHeight);
  }
  dispatch({
    type: LocalNodeActionType.UPDATE_ESTIMATED_TIME,
    data: time,
  });
}

function updateTempBreakTime(dispatch, getState) {
  const oldTempBreakTime = getState().LocalNodeStore.tempBreakTime;
  dispatch({
    type: LocalNodeActionType.UPDATE_TEMP_BREAK_TIME,
    data: oldTempBreakTime + 1,
  });
}

function updateBreakTime(dispatch, getState) {
  const oldBreakTime = getState().LocalNodeStore.breakTime;
  dispatch({
    type: LocalNodeActionType.UPDATE_BREAK_TIME,
    data: oldBreakTime + 1,
  });
}

export function restartTempBreakTimer() {
  return (dispatch, getState) => {
    tempBreakTimer && clearInterval(tempBreakTimer);
    dispatch({
      type: NodeActionType.UPDATE_TEMP_BREAK_TIME,
      data: 0,
    });
    tempBreakTimer = setInterval(() => {
      updateTempBreakTime(dispatch, getState);
    }, 1000);
  };
}

function startPoll(dispatch, getState) {
  stopPoll();
  timer = setInterval(() => {
    ont
      .get(`${LOCAL_PREFIX}26657/status?`)
      .then((res) => {
        console.log(res);
      })
      .catch((rpcRes) => {
        const { result = {} } = rpcRes;
        const info = result.sync_info || {};
        const oldLocalHeight = getState().LocalNodeStore.localHeight;
        const localHeight = info.latest_block_height - 0;
        const diffLocalHeight = localHeight - oldLocalHeight;
        if (localHeight) {
          dispatch({
            type: LocalNodeActionType.UPDATE_LOCAL_HEIGHT,
            data: localHeight,
          });
        }
        oldLocalHeight > 0 &&
          updateEstimatedTime(dispatch, getState, info, diffLocalHeight);
        const nowSync = !info.catching_up;
        const oldSync = getState().LocalNodeStore.isSync;
        if (oldSync !== nowSync) {
          if (nowSync) {
            breakTimer && clearInterval(breakTimer);
            tempBreakTimer && clearInterval(tempBreakTimer);
            dispatch({
              type: LocalNodeActionType.UPDATE_BREAK_TIME,
              data: 0,
            });
            dispatch({
              type: LocalNodeActionType.UPDATE_TEMP_BREAK_TIME,
              data: 0,
            });
            dispatch({
              type: LocalNodeActionType.UPDATE_IS_SYNC,
              data: true,
            });
          } else {
            dispatch({
              type: LocalNodeActionType.UPDATE_IS_SYNC,
              data: false,
            });
            if (!breakTimer) {
              breakTimer = setInterval(() => {
                updateBreakTime(dispatch, getState);
              }, 1000);
            }
            if (!tempBreakTimer) {
              tempBreakTimer = setInterval(() => {
                updateTempBreakTime(dispatch, getState);
              }, 1000);
            }
          }
        }
      });
  }, pollInterval);
}

export function startOkexchaind(datadir, func, terminal = false) {
  return async (dispatch, getState) => {
    const { localNodeDataStatus } = electronUtils;
    const statusInstance = localNodeDataStatus.getInstance(datadir);
    const dataStatus = statusInstance.get();
    const configDir = `${datadir}/config`;
    try {
      if (!dataStatus.hasInitData) {
        await initData(datadir);
        statusInstance.set({ hasInitData: true });
      }
      if (!dataStatus.hasDownloadGenesis) {
        await downloadGenesis(configDir);
        statusInstance.set({ hasDownloadGenesis: true });
      }
      if (!dataStatus.hasDownloadSeeds) {
        await downloadSeeds(configDir);
        statusInstance.set({ hasDownloadSeeds: true });
      }
      if (!dataStatus.hasSetSeeds) {
        await setSeeds(configDir);
        statusInstance.set({ hasSetSeeds: true });
      }
      await start(datadir, dispatch, getState, func, terminal);
      switchIsStarted(true)(dispatch);
      startPoll(dispatch, getState);
    } catch (e) {
      console.log(e);
    }
  };
}

export function startListen() {
  return async (dispatch, getState) => {
    startPoll(dispatch, getState);
  };
}

export function startTerminal() {
  return () => {
    getListenClient().start();
  };
}

export function stopTerminal() {
  return () => {
    getListenClient().stop();
  };
}

export function stopOkexchaind(terminal = false) {
  return (dispatch, getState) => {
    stopPoll();
    const okexchaindDir = getOkexchaindDir();
    const { shell, localNodeServerClient } = electronUtils;
    shell.cd(okexchaindDir);
    shell.exec('./okexchaind stop', (code) => {
      if (code === 0) {
        if (terminal) getListenClient().stop();
        localNodeServerClient.set(null);
        dispatch({
          type: LocalNodeActionType.UPDATE_OKEXCHAIND,
          data: null,
        });
        switchIsStarted(false)(dispatch);
      } else {
        Message.error({
          content: 'okexchaind top error',
        });
      }
    });
    dispatch({
      type: LocalNodeActionType.UPDATE_IS_SYNC,
      data: false,
    });
    if (!terminal) return;
    const { currentNode } = getState().NodeStore;
    if (currentNode.type === NODE_TYPE.LOCAL) {
      dispatch({
        type: NodeActionType.UPDATE_CURRENT_NODE,
        data: NODE_TYPE.NONE,
      });
    }
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

export function updateP2p(p2p) {
  return (dispatch) => {
    dispatch({
      type: LocalNodeActionType.UPDATE_P2P,
      data: p2p,
    });
  };
}

export function updateRest(rest) {
  return (dispatch) => {
    dispatch({
      type: LocalNodeActionType.UPDATE_REST,
      data: rest,
    });
  };
}

export function updateWs(ws) {
  return (dispatch) => {
    dispatch({
      type: LocalNodeActionType.UPDATE_WS,
      data: ws,
    });
  };
}

export function updateDatadir(datadir) {
  return (dispatch) => {
    dispatch({
      type: LocalNodeActionType.UPDATE_DATADIR,
      data: datadir,
    });
  };
}

export function updateDb(db) {
  return (dispatch) => {
    dispatch({
      type: LocalNodeActionType.UPDATE_DB,
      data: db,
    });
  };
}
