/* eslint-disable */

export const validateTxs = (res) => {
  const { result, status } = res;
  return !(status !== 200 || (result.code && result.code !== 0));
};
