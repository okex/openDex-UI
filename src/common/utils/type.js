export const getType = (val) =>
  Object.prototype.toString.call(val).replace(/\[object (\w+)\]/, '$1');

export const isNumberString = (num) => /^\d+(\.\d+)?$/.test(num);

export const isFunction = (val) => getType(val) === 'Function';

export const isString = (val) => getType(val) === 'String';

export const isArray = (val) => getType(val) === 'Array';
