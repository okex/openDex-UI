import { NODE_TYPE, MAX_LATENCY } from './Node';
import { getApiUrl } from './getApiUrl';

const httpUrl = getApiUrl();
const wsUrl = 'wss://dexcomreal.bafang.com:8443/ws/v3';

const commonNodeItems = {
  latency: MAX_LATENCY,
};

const remoteNodeItems = {
  ...commonNodeItems,
  type: NODE_TYPE.REMOTE,
};

export const LOCAL_PREFIX = 'http://127.0.0.1:';
export const LOCAL_PREFIX_WS = 'ws://127.0.0.1:';

export const DEFAULT_NODE = {
  ...remoteNodeItems,
  id: '001',
  wsUrl,
  region: 'Asia',
  httpUrl,
  country: 'China',
  location: 'Hong Kong',
};

export const NONE_NODE = {
  ...commonNodeItems,
  id: '100',
  wsUrl: '',
  region: '',
  httpUrl: '',
  country: '',
  location: '',
  type: NODE_TYPE.NONE,
};

export const NODE_LIST = [
  DEFAULT_NODE,
  {
    ...remoteNodeItems,
    id: '002',
    wsUrl,
    httpUrl,
    region: 'Asia',
    country: 'China',
    location: 'Shanghai',
  },
  {
    ...remoteNodeItems,
    id: '003',
    wsUrl,
    httpUrl,
    region: 'Asia',
    country: 'China',
    location: 'Hangzhou',
  },
  NONE_NODE,
];
