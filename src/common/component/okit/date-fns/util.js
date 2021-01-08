// 补零
export const padNum = (num) => {
  if (num >= 10) {
    return num;
  }
  return `0${num}`;
};

export const convertToNumber = (value) => {
  if (!value) {
    return null;
  }

  if (/^[0-9]*$/.test(value)) {
    return Number(value);
  }

  return value;
};

export const getDateDetail = (value) => {
  const realValue = convertToNumber(value);
  const date = realValue ? new Date(realValue) : new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();

  return {
    year,
    month: padNum(month),
    day: padNum(day),
    hour: padNum(hour),
    minute: padNum(minute),
    second: padNum(second),
    millisecond: padNum(millisecond),
  };
};

export const calculateDate = (value, unit, now) => {
  const amount = Number(value);
  let date = new Date();

  if (now) {
    date = now;
  }
  const { year, month, day, hour, minute, second, millisecond } = getDateDetail(
    date
  );
  const dateMap = {
    'y+': () => {
      return date.setFullYear(Number(year) + amount);
    },
    'M+': () => {
      return date.setMonth(Number(month) - 1 + amount);
    },
    'd+': () => {
      return date.setDate(Number(day) + amount);
    },
    'h+': () => {
      return date.setHours(Number(hour) + amount);
    },
    'm+': () => {
      return date.setMinutes(Number(minute) + amount);
    },
    's+': () => {
      return date.setSeconds(Number(second) + amount);
    },
    ms: () => {
      return date.setMilliseconds(Number(millisecond) + amount);
    },
  };
  const keys = Object.keys(dateMap);
  const dateKey = keys.find((key) => {
    return new RegExp(`${key}`).test(unit);
  });

  const handler = dateMap[dateKey];

  if (handler) {
    return handler();
  }

  return date;
};

export const firstDayOfWeek = () => {
  const date = new Date();
  return date.setDate(date.getDate() - date.getDay());
};

export const lastDay = (month) => {
  const { year } = getDateDetail();
  return new Date(year, month, 0);
};

export const isSafari = () => {
  const { userAgent } = window.navigator;
  return /Safari/.test(userAgent);
};
