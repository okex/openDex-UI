import BigNumber from 'bignumber.js';

function digitLength(num) {
  return BigNumber(num).dp();
}

function add(a, b) {
  return BigNumber(a).plus(b).toNumber();
}

function sub(a, b) {
  return BigNumber(a).minus(b).toNumber();
}

/**
 * 0.07 * 100 = 0.7000000000000001
 * 精确乘法
 */
function mul(a, b) {
  return BigNumber(a).times(b).toNumber();
}

/**
 * 0.7 / 100 = 0.006999999999999999
 * 精确除法
 */
function div(a, b) {
  BigNumber.config({ DECIMAL_PLACES: 40 });
  return BigNumber(a).div(b).toNumber();
}

/**
 * 添加千分位
 */
function thousandFormat(num) {
  return BigNumber(num).toFormat();
}

/**
 * 向上截位
 */
function ceilTruncate(num, digit, needZero = true) {
  if (!needZero) { // 不需要补零
    return BigNumber(num).toFixed(Math.min(digit, BigNumber(num).dp()), BigNumber.ROUND_CEIL);
  }
  return BigNumber(num).toFixed(digit, BigNumber.ROUND_CEIL);
}

/**
 * 向下截位
 */
function floorTruncate(num, digit, needZero = true) {
  if (!needZero) { // 不需要补零
    return BigNumber(num).toFixed(Math.min(digit, BigNumber(num).dp()), BigNumber.ROUND_FLOOR);
  }
  return BigNumber(num).toFixed(digit, BigNumber.ROUND_FLOOR);
}

/**
 * 四舍五入
 */
function truncate(num, digit, needZero = true) {
  if (!needZero) { // 不需要补零
    return BigNumber(num).toFixed(Math.min(digit, BigNumber(num).dp()));
  }
  return BigNumber(num).toFixed(digit);
}

/**
 * 向上截位并添加千分位
 */
function showCeilTruncation(num, digit, needZero = true) {
  return BigNumber(BigNumber(num).toFixed(digit, BigNumber.ROUND_CEIL)).toFormat(needZero ? digit : undefined);
}

/**
 * 向下截位并添加千分位
 */
function showFloorTruncation(num, digit, needZero = true) {
  return BigNumber(BigNumber(num).toFixed(digit, BigNumber.ROUND_FLOOR)).toFormat(needZero ? digit : undefined);
}

/**
 * 四舍五入并添加千分位
 */
function showTruncation(num, digit, needZero = true) {
  return BigNumber(BigNumber(num).toFixed(digit)).toFormat(needZero ? digit : undefined);
}

/**
 * 乘后向上截位
 */
function ceilMul(a, b, digit) {
  return BigNumber(a).times(b).toFixed(digit, BigNumber.ROUND_CEIL);
}

/**
 * 乘后向下截位
 */
function floorMul(a, b, digit) {
  return BigNumber(a).times(b).toFixed(digit, BigNumber.ROUND_FLOOR);
}

/**
 * 除后向上截位
 */
function ceilDiv(a, b, digit) {
  return BigNumber(a).div(b).toFixed(digit, BigNumber.ROUND_CEIL);
}

/**
 * 除后向下截位
 */
function floorDiv(a, b, digit) {
  return BigNumber(a).div(b).toFixed(digit, BigNumber.ROUND_FLOOR);
}

const calc = {
  digitLength,
  add,
  sub,
  mul,
  div,
  thousandFormat,
  ceilTruncate,
  floorTruncate,
  truncate,
  showCeilTruncation,
  showFloorTruncation,
  showTruncation,
  ceilMul,
  floorMul,
  ceilDiv,
  floorDiv,
  BigNumber
};
export default calc;
