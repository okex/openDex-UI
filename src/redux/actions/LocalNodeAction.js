import ont from '_src/utils/dataProxy';
import { commaLineBreak, divide, multiply } from '_src/utils/ramda';
import { storage } from '_component/okit';
import Message from '_src/component/Message';
import { NODE_TYPE, MAX_LATENCY } from '_constants/Node';
import { NONE_NODE, LOCAL_PREFIX, LOCAL_PREFIX_WS } from '_constants/apiConfig';
import { getStartCommand } from '_src/utils/command';
import LocalNodeActionType from '../actionTypes/LocalNodeActionType';
import NodeActionType from '../actionTypes/NodeActionType';

const electronUtils = window.require('electron').remote.require('./src/utils');

let timer = null;
const pollInterval = 3000;
let breakTimer = null;
let tempBreakTimer = null;

function getOkchaindDir() {
  const { store } = electronUtils;
  return store.get('okchaindDirectory');
}

function stopPoll() {
  timer && clearInterval(timer);
}

function start(datadir, dispatch, getState) {
  const { shell, localNodeServerClient } = electronUtils;
  const directory = getOkchaindDir();
  return new Promise((reslove, reject) => {
    try {
      shell.cd(directory);
      const {
        p2p, ws, rest, db,
      } = getState().LocalNodeStore;
      const startCommand = getStartCommand({
        p2p,
        ws,
        rest,
        datadir,
        db,
      });
      window.localStorage.setItem('isStarted',true);
      const child = localNodeServerClient.get() || shell.exec(`${startCommand}`, { async: true }, (code) => {
        console.log(code);
        if (code !== 130 && code !== 0) {
          Message.error({
            content: 'okchaind start error',
          });
          stopPoll();
          dispatch({
            type: LocalNodeActionType.UPDATE_IS_STARTED,
            data: false,
          });
        }
      });
      localNodeServerClient.set(child);
      listenClient(dispatch, getState);
      reslove(true);
    } catch (err) {
      reject(err);
    }
  });
}

function listenClient(dispatch, getState) {
  const { localNodeServerClient } = electronUtils;
  const child = localNodeServerClient.get();
  if(!child) return;
  child.stdout.on('data', (data) => {
    const { logs } = getState().LocalNodeStore;
    const newLog = data + logs;
    dispatch({
      type: LocalNodeActionType.UPDATE_LOGS,
      data: newLog,
    });
    dispatch({
      type: LocalNodeActionType.UPDATE_OKCHAIND,
      data: child,
    });
  });
  return;
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

function updateTempBreakTime (dispatch, getState) {
  const oldTempBreakTime = getState().LocalNodeStore.tempBreakTime;
  dispatch({
    type: LocalNodeActionType.UPDATE_TEMP_BREAK_TIME,
    data: oldTempBreakTime + 1,
  });
}

function updateBreakTime (dispatch, getState) {
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
  }
}

function startPoll(dispatch, getState) {
  stopPoll();
  timer = setInterval(() => {
    ont.get(`${LOCAL_PREFIX}26657/status?`).then((res) => {
      console.log(res);
    }).catch((rpcRes) => {
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
      oldLocalHeight > 0 && updateEstimatedTime(dispatch, getState, info, diffLocalHeight);
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
          const { currentNode } = getState().NodeStore;
          if (currentNode.type === NODE_TYPE.NONE) {
            const {
              rest, ws,
            } = getState().LocalNodeStore;
            const localNode = {
              name: 'Local',
              httpUrl: `${LOCAL_PREFIX}${rest}`,
              wsUrl: `${LOCAL_PREFIX_WS}${ws}/ws/v3?compress=true`,
              latency: MAX_LATENCY,
              id: '00000000',
              type: NODE_TYPE.LOCAL,
            };
            storage.set('currentNode', localNode);
            dispatch({
              type: NodeActionType.UPDATE_CURRENT_NODE,
              data: localNode,
            });
          }
        } else {
          dispatch({
            type: LocalNodeActionType.UPDATE_IS_SYNC,
            data: false
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
          const { currentNode } = getState().NodeStore;
          if (currentNode.type === NODE_TYPE.LOCAL) {
            dispatch({
              type: NodeActionType.UPDATE_CURRENT_NODE,
              data: NONE_NODE
            });
          }
        }
      }
    });
  }, pollInterval);
}

export function updateLogs(logs) {
  return (dispatch) => {
    dispatch({
      type: LocalNodeActionType.UPDATE_LOGS,
      data: logs,
    });
  };
}

export function startOkchaind(datadir) {
  return async (dispatch, getState) => {
    const isExist = await isDirExist(datadir);
    const configDir = `${datadir}/config`;
    if (isExist) {
      await start(datadir, dispatch, getState);
      startPoll(dispatch, getState);
    } else {
      await initData(datadir);
      await downloadGenesis(configDir);
      await downloadSeeds(configDir);
      await setSeeds(configDir);
      await start(datadir, dispatch, getState);
      startPoll(dispatch, getState);
    }
  };
}

export function startListen() {
  return async (dispatch, getState) => {
    listenClient(dispatch, getState);
  }
}

export function stopOkchaind() {
  return (dispatch, getState) => {
    stopPoll();
    const okchaindDir = getOkchaindDir();
    const { shell, localNodeServerClient } = electronUtils;
    shell.cd(okchaindDir);
    shell.exec('./okchaind stop', (code, stdout, stderr) => {
      if (code === 0) {
        dispatch({
          type: LocalNodeActionType.UPDATE_OKCHAIND,
          data: null,
        });
      }
    });
    window.localStorage.setItem('isStarted',false);
    localNodeServerClient.set(null);
    dispatch({
      type: LocalNodeActionType.UPDATE_IS_SYNC,
      data: false
    });
    const { currentNode } = getState().NodeStore;
    if (currentNode.type === NODE_TYPE.LOCAL) {
      dispatch({
        type: NodeActionType.UPDATE_CURRENT_NODE,
        data: NONE_NODE
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

export function updateIsSync(isSync) {
  return (dispatch) => {
    dispatch({
      type: LocalNodeActionType.UPDATE_IS_SYNC,
      data: isSync,
    });
  };
}
