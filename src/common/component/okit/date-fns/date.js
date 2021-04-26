import {
  getDateDetail,
  calculateDate,
  convertToNumber,
  lastDay,
  isSafari,
} from './util';
/**
 *
 * @param {*} value
 * @param {*} formater
 */
const format = (value, formater = 'yyyy-MM-dd hh:mm:ss') => {
  const { year, month, day, hour, minute, second } = getDateDetail(value);

  // 格式化逻辑
  const formatFns = {
    yyyy() {
      return year;
    },
    yy() {
      return year % 100;
    },
    M() {
      return month;
    },
    MM() {
      return month;
    },
    d() {
      return day;
    },
    dd() {
      return day;
    },
    hh() {
      return hour;
    },
    mm() {
      return minute;
    },
    ss() {
      return second;
    },
  };

  return formater.replace(/([a-z])(\1)*/gi, (match) => {
    const fn = formatFns[match];
    return fn ? fn() : '';
  });
};

/**
 * 字符串格式化为 ISO
 * @param {*} value
 */
const formatToISOString = (value) => {
  const realValue = convertToNumber(value);
  const date = realValue ? new Date(realValue) : new Date();
  return date.toISOString();
};

/**
 * 增加日期
 * @param {*} amount
 * @param {*} unit
 * @param {*} now 在此日期增加（可选）
 * add(1, 'y')
 */
const add = (amount, unit, now) => {
  const result = calculateDate(amount, unit, now);
  return new Date(result);
};

/**
 * 减少日期
 * @param {*} amount
 * @param {*} unit
 * @param {*} now 在此日期减少（可选）
 * subtract(1, 'y')
 */
const subtract = (amount, unit) => {
  const result = calculateDate(-amount, unit);
  return new Date(result);
};

/**
 * 获取日期
 * @param {*} unit
 * get('M')  获取当前月
 */
const get = (unit) => {
  const {
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
  } = getDateDetail();
  const dateMap = {
    'y+': year,
    'M+': month,
    'd+': day,
    'h+': hour,
    'm+': minute,
    's+': second,
    ms: millisecond,
  };

  const keys = Object.keys(dateMap);
  const dateKey = keys.find(
    (key) =>
      (/y\+|d\+|h\+/.test(key) && new RegExp(`${key}`, 'i').test(unit)) ||
      new RegExp(`${key}`).test(unit)
  );

  return dateMap[dateKey] || '';
};

/**
 * 设置日期
 * @param {*} options
 * set({y: 1, M: 1, d: 15})
 */
const set = (options) => {
  let date = new Date();
  const dateMap = {
    'y+': 'setFullYear',
    'M+': 'setMonth',
    'd+': 'setDate',
    'h+': 'setHours',
    'm+': 'setMinutes',
    's+': 'setSeconds',
    ms: 'setMilliseconds',
  };

  const keys = Object.keys(dateMap);
  Object.entries(options).forEach((option) => {
    const dateKey = keys.find((key) => new RegExp(`${key}`).test(option[0]));

    if (dateMap[dateKey]) {
      if ('M+'.includes(dateKey)) {
        date = new Date(date[dateMap[dateKey]](option[1] - 1));
      } else {
        date = new Date(date[dateMap[dateKey]](option[1]));
      }
    }
  });

  return date;
};

/**
 * 转换为json
 */
const toObject = () => getDateDetail();

const toDate = (value) => {
  const realValue = convertToNumber(value);
  return realValue ? new Date(realValue) : new Date();
};

const startOf = (value, unit = 'd') => {
  const realValue = value || new Date();
  const dateMap = {
    'y+': 'yyyy-01-01 00:00:00',
    'M+': 'yyyy-MM-01 00:00:00',
    'd+': 'yyyy-MM-dd 00:00:00',
    'h+': 'yyyy-MM-dd hh:00:00',
    'm+': 'yyyy-MM-dd hh:mm:00',
  };
  const keys = Object.keys(dateMap);
  const dateKey = keys.find((key) => new RegExp(`${key}`).test(unit));

  let date = format(realValue, dateMap[dateKey]);

  if (isSafari) {
    date = date.replace(/-/g, '/');
  }

  return date ? new Date(date) : '';
};

const endOf = (value, unit = 'd') => {
  const realValue = value || new Date();
  const { month } = getDateDetail(realValue);

  const dateMap = {
    'y+': 'yyyy-12-dd 23:59:59',
    'M+': 'yyyy-MM-dd 23:59:59',
    'd+': 'yyyy-MM-dd 23:59:59',
    'h+': 'yyyy-MM-dd hh:59:59',
    'm+': 'yyyy-MM-dd hh:mm:59',
  };

  const keys = Object.keys(dateMap);
  const dateKey = keys.find((key) => new RegExp(`${key}`).test(unit));

  let date = format(realValue, dateMap[dateKey]);

  if (/y+/.test(unit)) {
    date = format(lastDay(12), dateMap['y+']);
  }

  if (/M+/.test(unit)) {
    date = format(lastDay(month), dateMap['M+']);
  }

  if (isSafari) {
    date = date.replace(/-/g, '/');
  }

  return date ? new Date(date) : '';
};

const valueOf = () => new Date().valueOf();

export default {
  format,
  formatToISOString,
  add,
  subtract,
  set,
  get,
  toObject,
  toDate,
  startOf,
  endOf,
  valueOf,
};
