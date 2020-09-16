import { emptyLineBreak } from '_src/utils/ramda';
import LocalNodeActionType from '../actionTypes/LocalNodeActionType';

const electronUtils = window.require('electron').remote.require('./src/utils');

const getHomePath = () => {
  const { shell } = electronUtils;
  shell.cd('~');
  const p = shell.pwd();
  const path = emptyLineBreak(p.toString());
  return path;
};

const getInitDataDir = () => {
  const path = getHomePath();
  const datadir = `${emptyLineBreak(path)}/.okchaind`;
  return datadir;
};

const getInitDb = () => {
  const path = getHomePath();
  const db = `${emptyLineBreak(path)}/.okchaind/data/backend.sqlite3`;
  return db;
};

export default function() {
  const initialState = {
    logs: '',
    okchaind: null,
    isStarted: !!electronUtils.localNodeServerClient.get(),
    p2p: '26656',
    rest: '26659',
    ws: '26661',
    datadir: getInitDataDir(),
    db: getInitDb(),
    isSync: false,
    localHeight: 0,
    estimatedTime: 0, // unit:ms
    breakTime: 0, // unit:s
    tempBreakTime: 0, // unit:s
    datadirAtStart: '',
  };

  return function(state = initialState, action) {
    switch (action.type) {
      case LocalNodeActionType.UPDATE_LOGS:
        return {
          ...state,
          logs: action.data,
        };
      case LocalNodeActionType.UPDATE_OKCHAIND:
        return {
          ...state,
          okchaind: action.data,
        };
      case LocalNodeActionType.UPDATE_IS_STARTED:
        return {
          ...state,
          isStarted: action.data,
        };
      case LocalNodeActionType.UPDATE_SETTING:
        return {
          ...state,
          localNodeSetting: action.data,
        };
      case LocalNodeActionType.UPDATE_P2P:
        return {
          ...state,
          p2p: action.data,
        };
      case LocalNodeActionType.UPDATE_REST:
        return {
          ...state,
          rest: action.data,
        };
      case LocalNodeActionType.UPDATE_WS:
        return {
          ...state,
          ws: action.data,
        };
      case LocalNodeActionType.UPDATE_DATADIR:
        return {
          ...state,
          datadir: action.data,
        };
      case LocalNodeActionType.UPDATE_DB:
        return {
          ...state,
          db: action.data,
        };
      case LocalNodeActionType.UPDATE_IS_SYNC:
        return {
          ...state,
          isSync: action.data,
        };
      case LocalNodeActionType.UPDATE_LOCAL_HEIGHT:
        return {
          ...state,
          localHeight: action.data,
        };
      case LocalNodeActionType.UPDATE_ESTIMATED_TIME:
        return {
          ...state,
          estimatedTime: action.data,
        };
      case LocalNodeActionType.UPDATE_BREAK_TIME:
        return {
          ...state,
          breakTime: action.data,
        };
      case LocalNodeActionType.UPDATE_TEMP_BREAK_TIME:
        return {
          ...state,
          tempBreakTime: action.data,
        };
      case LocalNodeActionType.UPDATE_DATADIR_AT_START:
        return {
          ...state,
          datadirAtStart: action.data,
        };
      default:
        return state;
    }
  }
}
