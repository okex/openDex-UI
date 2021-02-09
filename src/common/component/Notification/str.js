/**
 * 首字母大写
 *
 * @export
 * @param {*} target
 * @returns
 */
function firstLettersUppercase(target) {
  const res = `${target}`;
  return res.toUpperCase() + res.slice(1);
}

/**
 * 首字母小写
 *
 * @export
 * @param {*} target
 * @returns
 */
function firstLettersLowercase(target) {
  const res = `${target}`;
  return res.toLowerCase() + res.slice(1);
}

/**
 * 小驼峰 -> 短横线
 *
 * @export
 * @param {*} target
 * @returns
 */
function reverseCase(target) {
  if (typeof target !== 'string') {
    return target;
  }
  return target.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export default {
  firstLettersUppercase,
  firstLettersLowercase,
  reverseCase
};
