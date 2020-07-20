/* eslint-disable */
const httpUrl = navigator.userAgent.includes('Electron') && window.location.protocol.includes('file') ? 'https://www.okex.com' : 'http://127.0.0.1:7777';
const wsUrl = 'wss://dexcomreal.bafang.com:8443/ws/v3';

export const DEFAULT_NODE = {
  id: '001',
  wsUrl,
  region: 'Asia',
  httpUrl,
  country: 'China',
  location: "Hong Kong",
};

export const NODE_LIST = [
  DEFAULT_NODE,
  {
    id: '002',
    wsUrl,
    httpUrl,
    region: 'Asia',
    country: 'China',
    location: "Shanghai",
  },
  {
    id: '003',
    wsUrl,
    httpUrl,
    region: 'Asia',
    country: 'China',
    location: "Hangzhou",
  }
];
