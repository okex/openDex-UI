import hirestime from 'hirestime';
import { calc } from '_component/okit';
import { MAX_LATENCY, NODE_LATENCY_TYPE, NODE_TYPE } from '_constants/Node';

const TIMEOUT = 2000;

export const getDelayType = (delayTime) => {
  let delayType;
  if (delayTime === MAX_LATENCY) {
    delayType = NODE_LATENCY_TYPE.UNREACHABLE;
  } else if (delayTime > 150) {
    delayType = NODE_LATENCY_TYPE.HIGH;
  } else {
    delayType = NODE_LATENCY_TYPE.LOW;
  }
  return delayType;
};

export const getNodeLatency = (node) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MAX_LATENCY);
    }, TIMEOUT);
    const { wsUrl } = node;
    if (wsUrl) {
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
    } else {
      resolve(MAX_LATENCY);
    }
  });
};

export const getNodeRenderName = (node) => {
  let renderName = '';
  const {
    type, region, country, location, name
  } = node;
  if (type === NODE_TYPE.REMOTE) {
    renderName = `${region} - ${country} - ${location}`;
  } else if (type === NODE_TYPE.CUSTOM || type === NODE_TYPE.LOCAL) {
    renderName = name;
  } else {
    renderName = 'None';
  }
  return renderName;
};

export const timeUnit = (t) => {
  let time = t;
  if (!time || time === MAX_LATENCY) {
    return '- -';
  }
  const suffix = ['ms', 's'];
  const carry = 1000;
  let index = 0;
  while (time >= carry && index < suffix.length - 1) {
    time = calc.div(time, carry);
    index++;
  }
  return `${time}${suffix[index]}`;
};
