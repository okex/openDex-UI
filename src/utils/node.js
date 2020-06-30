import hirestime from 'hirestime';
import { storage } from '_src/component/okit';
import { MAX_LATENCY, NODE_TYPE } from '_constants/Node';

const TIMEOUT = 2000;

export const getDelayType = (delayTime) => {
  let delayType;
  if (delayTime === MAX_LATENCY) {
    delayType = NODE_TYPE.UNREACHABLE;
  } else if (delayTime > 150) {
    delayType = NODE_TYPE.HIGH;
  } else {
    delayType = NODE_TYPE.LOW;
  }
  return delayType;
};

export const setcurrentNode = (node) => {
  storage.set('currentNode', node);
  window.location.reload();
};

export const getNodeLatency = (node) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MAX_LATENCY);
    }, TIMEOUT);
    const { wsUrl } = node;
    const connection = new window.WebSocketCore({ connectUrl: wsUrl });
    let getElapsed;
    connection.onSocketError(() => {
      resolve(MAX_LATENCY);
    });
    connection.onSocketConnected(() => {
      connection.sendChannel('ping');
      getElapsed = hirestime();
    });
    connection.setPushDataResolver(() => {
      const pingTime = getElapsed && getElapsed();
      connection.disconnect();
      resolve(pingTime);
    });
    connection.connect();
  });
};
