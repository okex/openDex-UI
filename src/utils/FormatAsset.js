import { toLocale } from '_src/locale/react-locale';
import { calc } from '_component/okit';
import util from '../utils/util';

import Enum from './Enum';

const FormatAsset = {
  // 获取现货交易资产(币币交易资产)
  getSpotData(product, account, productConfig) {
    if (!product || !productConfig) {
      return null;
    }
    // 两种精度可能为0，所以用undefined进行判断
    const sizeTruncate = typeof productConfig.max_size_digit !== 'undefined' ? productConfig.max_size_digit : 4;
    const quoteSizeTruncate = typeof productConfig.quotePrecision !== 'undefined' ? productConfig.quotePrecision : 4;

    // 交易货币信息
    const baseCurr = product.indexOf('_') > -1 ? product.split('_')[0].toUpperCase() : '-';
    const baseCurrAccount = account[baseCurr.toLowerCase()];
    const baseCurrAvail = baseCurrAccount ?
      calc.showFloorTruncation(baseCurrAccount.available, sizeTruncate)
      :
      calc.showFloorTruncation(0, sizeTruncate);
    const baseCurrFreeze = baseCurrAccount ?
      calc.showFloorTruncation(baseCurrAccount.locked, sizeTruncate)
      :
      calc.showFloorTruncation(0, sizeTruncate);

    // 计价货币信息
    const quoteCurr = product.indexOf('_') > -1 ? product.split('_')[1].toUpperCase() : '-';
    const quoteCurrAccount = account[quoteCurr.toLowerCase()];
    const quoteCurrAvail = quoteCurrAccount ?
      calc.showFloorTruncation(quoteCurrAccount.available, quoteSizeTruncate)
      :
      calc.showFloorTruncation(0, quoteSizeTruncate);
    const quoteCurrFreeze = quoteCurrAccount ?
      calc.showFloorTruncation(quoteCurrAccount.locked, quoteSizeTruncate)
      :
      calc.showFloorTruncation(0, quoteSizeTruncate);

    return [{
      currencyName: baseCurr,
      available: baseCurrAvail,
      locked: baseCurrFreeze
    }, {
      currencyName: quoteCurr,
      available: quoteCurrAvail,
      locked: quoteCurrFreeze
    }];
  },
  // 获取现货交易资产(币币交易资产) - 非登录下
  getSpotDataNotLogin(product) {
    const { productConfig } = window.OK_GLOBAL;
    if (!product || !productConfig) {
      return undefined;
    }
    // 两种精度可能为0，所以用undefined进行判断
    const sizeTruncate = typeof productConfig.max_size_digit !== 'undefined' ? productConfig.max_size_digit : 4;
    const quoteSizeTruncate = typeof productConfig.quotePrecision !== 'undefined' ? productConfig.quotePrecision : 4;

    // 计价货币信息
    const quoteCurr = product.indexOf('_') > -1 ? product.split('_')[1].toUpperCase() : '-';
    // 交易货币信息
    const baseCurr = product.indexOf('_') > -1 ? product.split('_')[0].toUpperCase() : '-';
    return [{
      currencyName: baseCurr,
      available: calc.showFloorTruncation(0, sizeTruncate),
      locked: calc.showFloorTruncation(0, sizeTruncate)
    }, {
      currencyName: quoteCurr,
      available: calc.showFloorTruncation(0, quoteSizeTruncate),
      locked: calc.showFloorTruncation(0, quoteSizeTruncate)
    }];
  }
};

export default FormatAsset;
