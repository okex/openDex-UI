import { toLocale } from '_src/locale/react-locale';
import { calc } from '_component/okit';
import util from './util';

import Enum from './Enum';

const FormatAsset = {
  getSpotData(product, account, productConfig) {
    if (!product || !productConfig) {
      return null;
    }
    const sizeTruncate =
      typeof productConfig.max_size_digit !== 'undefined'
        ? productConfig.max_size_digit
        : 4;
    const quoteSizeTruncate =
      typeof productConfig.quotePrecision !== 'undefined'
        ? productConfig.quotePrecision
        : 4;

    const baseCurr =
      product.indexOf('_') > -1 ? product.split('_')[0].toUpperCase() : '-';
    const baseCurrAccount = account[baseCurr.toLowerCase()];
    const baseCurrAvail = baseCurrAccount
      ? calc.showFloorTruncation(baseCurrAccount.available, sizeTruncate)
      : calc.showFloorTruncation(0, sizeTruncate);
    const baseCurrFreeze = baseCurrAccount
      ? calc.showFloorTruncation(baseCurrAccount.locked, sizeTruncate)
      : calc.showFloorTruncation(0, sizeTruncate);

    const quoteCurr =
      product.indexOf('_') > -1 ? product.split('_')[1].toUpperCase() : '-';
    const quoteCurrAccount = account[quoteCurr.toLowerCase()];
    const quoteCurrAvail = quoteCurrAccount
      ? calc.showFloorTruncation(quoteCurrAccount.available, quoteSizeTruncate)
      : calc.showFloorTruncation(0, quoteSizeTruncate);
    const quoteCurrFreeze = quoteCurrAccount
      ? calc.showFloorTruncation(quoteCurrAccount.locked, quoteSizeTruncate)
      : calc.showFloorTruncation(0, quoteSizeTruncate);

    return [
      {
        currencyName: baseCurr,
        available: baseCurrAvail,
        locked: baseCurrFreeze,
      },
      {
        currencyName: quoteCurr,
        available: quoteCurrAvail,
        locked: quoteCurrFreeze,
      },
    ];
  },
  getSpotDataNotLogin(product) {
    const { productConfig } = window.OK_GLOBAL;
    if (!product || !productConfig) {
      return undefined;
    }
    const sizeTruncate =
      typeof productConfig.max_size_digit !== 'undefined'
        ? productConfig.max_size_digit
        : 4;
    const quoteSizeTruncate =
      typeof productConfig.quotePrecision !== 'undefined'
        ? productConfig.quotePrecision
        : 4;

    const quoteCurr =
      product.indexOf('_') > -1 ? product.split('_')[1].toUpperCase() : '-';
    const baseCurr =
      product.indexOf('_') > -1 ? product.split('_')[0].toUpperCase() : '-';
    return [
      {
        currencyName: baseCurr,
        available: calc.showFloorTruncation(0, sizeTruncate),
        locked: calc.showFloorTruncation(0, sizeTruncate),
      },
      {
        currencyName: quoteCurr,
        available: calc.showFloorTruncation(0, quoteSizeTruncate),
        locked: calc.showFloorTruncation(0, quoteSizeTruncate),
      },
    ];
  },
};

export default FormatAsset;
