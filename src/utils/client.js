/* eslint-disable */
// import { isArray, isString } from './type';

/**
 * @description validate sdk txs
 * @param {Object} res
 * @returns {boolean}
 */
export const validateTxs = (res) => {
  const { result, status } = res;
  // let log = JSON.parse(result.raw_log);
  // if (isArray(log)) {
  //   log = log[0].log;
  //   log = log.length > 0 ? JSON.parse(log) : log;
  // }
  // return !(status !== 200 || (log && log.code))
  return !(status !== 200 || (result.code && result.code !== 0));
};
