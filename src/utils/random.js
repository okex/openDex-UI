/**
 * @param {Number} m
 * @param {Number} n
 */
export const randomNumber = (m, n) => {
  return Math.floor((m + (Math.random() * (n - m + 1))));
};

/**
 * @param {Number} l
 */
export const randomStrNumber = (l) => {
  let ret = '';
  for (let i = 0; i < l; i++) {
    ret += randomNumber(0, 9);
  }
  return ret;
};
