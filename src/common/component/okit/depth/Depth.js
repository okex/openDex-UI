import calc from '../calc';

const TYPE_ASK = 0;
const TYPE_BID = 1;

const sortByPriceDesc = (list) => {
  list.sort((a, b) => {
    return b[0] - a[0];
  });
};

const defaultConfig = {
  maxSize: 200,
  minAmount: 0.001,
  needSum: false,
  convertPrice: false,
  convertAmount: false,
};
class Depth {
  constructor(config) {
    this.config = {
      ...defaultConfig,
      ...config,
    };
    this.askDepthCache = [];
    this.bidDepthCache = [];
  }
  spliceMoreThanMaxInternal({ data, type }) {
    const { maxSize } = this.config;
    if (data.length > maxSize) {
      if (type === TYPE_ASK) {
        data.splice(0, data.length - maxSize);
      } else {
        data.splice(maxSize, data.length - maxSize);
      }
    }
  }
  convertInternal(depthItem) {
    const { convertPrice, convertAmount, minAmount } = this.config;
    const price = depthItem[0];
    const amount = depthItem[1];
    if (convertPrice) {
      depthItem[0] = convertPrice({ price, amount });
    }
    if (convertAmount) {
      depthItem[1] = convertAmount({ price, amount });
      if (depthItem[1] < minAmount) {
        depthItem[1] = minAmount;
      }
    }
  }
  addDataInternal({ data, type }) {
    const isAsk = type === TYPE_ASK;
    const cacheData = isAsk ? this.askDepthCache : this.bidDepthCache;
    const { convertPrice, convertAmount } = this.config;
    if (cacheData.length === 0) {
      sortByPriceDesc(data);
      this.spliceMoreThanMaxInternal({ data, type });
      data.forEach((depthItem) => {
        depthItem[0] /= 1;
        depthItem[1] /= 1;
        this.convertInternal(depthItem);
      });
      if (isAsk) {
        this.askDepthCache = data;
      } else {
        this.bidDepthCache = data;
      }
      return data;
    }
    data.forEach((depthItem) => {
      depthItem[0] /= 1;
      depthItem[1] /= 1;
      if (convertPrice || convertAmount) {
        this.convertInternal(depthItem);
      }
      const price = depthItem[0];
      const amount = depthItem[1];
      const index = cacheData.findIndex((item) => {
        return item[0] === price;
      });
      if (index !== -1) {
        if (amount > 0) {
          cacheData[index] = depthItem;
        } else {
          cacheData.splice(index, 1);
        }
      } else if (amount > 0) {
        cacheData.push(depthItem);
      }
    });
    sortByPriceDesc(cacheData);
    this.spliceMoreThanMaxInternal({ data: cacheData, type });
    return cacheData;
  }
  getDepthInternal({ type, ladder, size }) {
    const isAsk = type === TYPE_ASK;
    const cacheDepth = isAsk ? this.askDepthCache : this.bidDepthCache;
    if (cacheDepth.length < 1) {
      return [];
    }
    if (ladder === 0) {
      return cacheDepth;
    }
    const resultList = [];
    let depthItemCache = [];
    let ladderValueFlag = -1;
    const ladderDigits = calc.digitLength(ladder);
    let cacheDepthIndex = isAsk ? cacheDepth.length - 1 : 0;
    let sum = 0;
    const cacheDepthLen = cacheDepth.length;
    for (let i = 0; i < cacheDepthLen; i++) {
      const { needSum } = this.config;
      const depthItem = cacheDepth[cacheDepthIndex];
      let ladderValue;
      const depthItemPrice = depthItem[0];
      const depthItemAmount = depthItem[1];
      if (isAsk) {
        cacheDepthIndex--;
        if (ladder >= 10) {
          ladderValue = Math.ceil(calc.div(depthItemPrice, ladder)) * ladder;
        } else {
          ladderValue = calc.ceilTruncate(depthItemPrice, ladderDigits) / 1;
        }
      } else {
        cacheDepthIndex++;
        if (ladder >= 10) {
          ladderValue = Math.floor(calc.div(depthItemPrice, ladder)) * ladder;
        } else {
          ladderValue = calc.floorTruncate(depthItemPrice, ladderDigits) / 1;
        }
      }

      if (ladderValueFlag != ladderValue) {
        if (resultList.length == size) {
          break;
        }
        if (depthItemAmount < this.config.minAmount) {
          depthItem[1] = this.config.minAmount;
        }
        depthItemCache = [...depthItem];
        depthItemCache[0] = ladderValue;
        ladderValueFlag = ladderValue;
        if (needSum) {
          sum = calc.add(sum, depthItemAmount);
          depthItemCache.push(sum);
        }
        resultList.push(depthItemCache);
      } else {
        const itemLen = depthItem.length;
        for (let j = 1; j < itemLen; j++) {
          depthItemCache[j] = depthItemCache[j] / 1 + depthItem[j] / 1;
        }
        if (needSum) {
          sum = calc.add(sum, depthItemAmount);
          depthItemCache[itemLen] = sum;
        }
      }
    }
    if (isAsk) {
      resultList.reverse();
    }
    return resultList;
  }
  addData(pushData) {
    return {
      asks: this.addDataInternal({ data: pushData.asks || [], type: TYPE_ASK }),
      bids: this.addDataInternal({ data: pushData.bids || [], type: TYPE_BID }),
    };
  }

  getDepth(ladder, size) {
    return {
      asks: this.getDepthInternal({ type: TYPE_ASK, ladder, size }),
      bids: this.getDepthInternal({ type: TYPE_BID, ladder, size }),
    };
  }

  getData(size) {
    if (!size) {
      return {
        asks: this.askDepthCache,
        bids: this.bidDepthCache,
      };
    }
    return {
      asks: this.askDepthCache.slice(-size),
      bids: this.bidDepthCache.slice(0, size),
    };
  }

  clear() {
    this.askDepthCache = [];
    this.bidDepthCache = [];
  }

  setConfig(config) {
    this.config = {
      ...this.config,
      ...config,
    };
  }
}

export default Depth;
