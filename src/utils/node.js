import hirestime from 'hirestime';
import { MAX_LATENCY, NODE_LATENCY_TYPE, NODE_TYPE } from '_constants/Node';
import { carry, fixed } from '_src/utils/ramda';

const TIMEOUT = 2000;

const timeData = [
  {
    suffix: 'MS',
    scale: 1000,
  },
  {
    suffix: 'S',
    scale: 60,
  },
  {
    suffix: 'MIN',
    scale: 60,
  },
  {
    suffix: 'H',
    scale: 24,
  },
  {
    suffix: 'D',
  },
];

const fixed0 = fixed(0);

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
        connection.disconnect();
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
  if (!t || t === MAX_LATENCY) {
    return '- -';
  }
  const [time, suffix] = carry(timeData.slice(0, 2), t);
  return `${parseFloat(fixed(2, time))}${suffix}`;
};

/**
 * @param {string} timestamp
 */
export const formatEstimatedTime = (t) => {
  const [time, suffix] = carry(timeData, fixed0(t));
  return `${fixed0(time)}${suffix}`;
};
