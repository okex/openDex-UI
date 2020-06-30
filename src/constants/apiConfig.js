/* eslint-disable */
const httpUrl = navigator.userAgent.includes('Electron') && window.location.protocol.includes('file') ? 'https://www.okex.com' : 'http://127.0.0.1:7777';
const wsUrl = 'wss://dexcomreal.bafang.com:8443/ws/v3';

export const settingsAPIs = {
  DEFAULT_NODE: {
    wsUrl,
    region: 'Asia',
    httpUrl,
    country: 'China',
    location: "Hong Kong",
  },
  NODE_LIST: [
    {
      wsUrl,
      httpUrl,
      region: 'Asia',
      country: 'China',
      location: "Hong Kong",
    },
    {
      wsUrl,
      httpUrl,
      region: 'Asia',
      country: 'China',
      location: "Shanghai",
    },
    {
      wsUrl,
      httpUrl,
      region: 'Asia',
      country: 'China',
      location: "Hangzhou",
    }
  ]
};
