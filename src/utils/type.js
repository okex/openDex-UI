export const getType = (val) => {
  return Object.prototype.toString.call(val).replace(/\[object (\w+)\]/, '$1');
};

export const isNumberString = (num) => {
  return /^\d+(\.\d+)?$/.test(num);
};

export const isFunction = (val) => {
  return getType(val) === 'Function';
};

export const isString = (val) => {
  return getType(val) === 'String';
};

export const isArray = (val) => {
  return getType(val) === 'Array';
};
