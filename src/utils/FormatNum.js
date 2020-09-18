export default class FormatNum {
  static NumAddDot(n) {
    let newN = n.toString();
    let lessThan0 = false;
    if (newN.indexOf('-') === 0) {
      lessThan0 = true;
      newN = newN.substring(1);
    }
    const re = /\d{1,3}(?=(\d{3})+$)/g;
    const n1 = newN.replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => {
      return s1.replace(re, '$&,') + s2;
    });
    return lessThan0 ? `-${n1}` : n1;
  }

  static CheckInputNumber = (inputValue, precision) => {
    const valueArray = inputValue.toString().replace(/\s+/g, '').split('.');
    if (valueArray.length > 1) {
      return `${valueArray[0].replace(/\D/g, '')}.${valueArray[1]
        .replace(/\D/g, '')
        .slice(0, precision)}`;
    }
    return valueArray[0].replace(/\D/g, '');
  };
  static formatNumber2String = (num) => {
    const str = String(num);
    let retStr = '';
    if (str.indexOf('.') >= 0) {
      let appendix = '';
      const len = 8 - str.split('.')[1].length;
      for (let i = 0; i < len; i++) {
        appendix += '0';
      }
      retStr = str + appendix;
    } else {
      retStr += `${str}.00000000`;
    }
    return retStr;
  };

  static hashShort = (hash = '') => {
    return hash.replace(/^(.{10}).*(.{6})$/, '$1...$2');
  };
  static formatFeeStr = (feeStr = '') => {
    if (!feeStr) {
      return '';
    }
    const arr = /(\d*\.*\d*)\s*(\w*)/.exec(feeStr);
    return `${arr[1]} ${arr[2]}`;
  };
}
