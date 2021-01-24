import BigNumber from 'bignumber.js';

function digitLength(num) {
  return BigNumber(num).dp();
}

function add(a, b, toNumber=true) {
  if(!toNumber) return BigNumber(a).plus(b);
  return BigNumber(a).plus(b).toNumber();
}

function sub(a, b, toNumber=true) {
  if(!toNumber) return BigNumber(a).minus(b);
  return BigNumber(a).minus(b).toNumber();
}

function mul(a, b, toNumber=true) {
  if(!toNumber) return BigNumber(a).times(b);
  return BigNumber(a).times(b).toNumber();
}

function div(a, b, toNumber=true) {
  BigNumber.config({ DECIMAL_PLACES: 40 });
  if(!toNumber) return BigNumber(a).div(b);
  return BigNumber(a).div(b).toNumber();
}

function thousandFormat(num) {
  return BigNumber(num).toFormat();
}

function ceilTruncate(num, digit, needZero = true) {
  if (!needZero) {
    return BigNumber(num).toFixed(
      Math.min(digit, BigNumber(num).dp()),
      BigNumber.ROUND_CEIL
    );
  }
  return BigNumber(num).toFixed(digit, BigNumber.ROUND_CEIL);
}

function floorTruncate(num, digit, needZero = true) {
  if (!needZero) {
    return BigNumber(num).toFixed(
      Math.min(digit, BigNumber(num).dp()),
      BigNumber.ROUND_FLOOR
    );
  }
  return BigNumber(num).toFixed(digit, BigNumber.ROUND_FLOOR);
}

function truncate(num, digit, needZero = true) {
  if (!needZero) {
    return BigNumber(num).toFixed(Math.min(digit, BigNumber(num).dp()));
  }
  return BigNumber(num).toFixed(digit);
}

function showCeilTruncation(num, digit, needZero = true) {
  return BigNumber(
    BigNumber(num).toFixed(digit, BigNumber.ROUND_CEIL)
  ).toFormat(needZero ? digit : undefined);
}

function showFloorTruncation(num, digit, needZero = true) {
  return BigNumber(
    BigNumber(num).toFixed(digit, BigNumber.ROUND_FLOOR)
  ).toFormat(needZero ? digit : undefined);
}

function showTruncation(num, digit, needZero = true) {
  return BigNumber(BigNumber(num).toFixed(digit)).toFormat(
    needZero ? digit : undefined
  );
}

function ceilMul(a, b, digit, needZero = true) {
  const num = BigNumber(a).times(b).toFixed(digit, BigNumber.ROUND_CEIL);
  if (!needZero) {
    return BigNumber(num).toFixed(
      Math.min(digit, BigNumber(num).dp()),
      BigNumber.ROUND_FLOOR
    );
  }
  return num;
}

function floorMul(a, b, digit, needZero = true) {
  const num = BigNumber(a).times(b).toFixed(digit, BigNumber.ROUND_FLOOR);
  if (!needZero) {
    return BigNumber(num).toFixed(
      Math.min(digit, BigNumber(num).dp()),
      BigNumber.ROUND_FLOOR
    );
  }
  return num;
}

function ceilDiv(a, b, digit, needZero = true) {
  const num = BigNumber(a).div(b).toFixed(digit, BigNumber.ROUND_CEIL);
  if (!needZero) {
    return BigNumber(num).toFixed(
      Math.min(digit, BigNumber(num).dp()),
      BigNumber.ROUND_FLOOR
    );
  }
  return num;
}

function floorDiv(a, b, digit, needZero = true) {
  const num = BigNumber(a).div(b).toFixed(digit, BigNumber.ROUND_FLOOR);
  if (!needZero) {
    return BigNumber(num).toFixed(
      Math.min(digit, BigNumber(num).dp()),
      BigNumber.ROUND_FLOOR
    );
  }
  return num;
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
  BigNumber,
};
export default calc;
