import calc from '../calc';

const TYPE_ASK = 0; // 卖
const TYPE_BID = 1; // 买

// 价格降序，调用此方法会修改原数组
const sortByPriceDesc = (list) => {
  list.sort((a, b) => {
    return b[0] - a[0];
  });
};

// 默认配置
const defaultConfig = {
  // 缓存最大长度
  maxSize: 200,
  // 合并完成后的最小数量
  minAmount: 0.001,
  // 是否需要累积量
  needSum: false,
  // 自定义价格转换函数
  convertPrice: false,
  // 自定义数量转换函数
  convertAmount: false
};
// 对外暴露Depth类
class Depth {
  constructor(config) {
    this.config = {
      ...defaultConfig,
      ...config
    };
    // 卖单缓存
    this.askDepthCache = [];
    // 买单缓存
    this.bidDepthCache = [];
  }
  // 对超过maxSize的数据进行截取
  spliceMoreThanMaxInternal({ data, type }) {
    const { maxSize } = this.config;
    if (data.length > maxSize) {
      // 超过指定条数时 删除多余数据
      if (type === TYPE_ASK) {
        // 卖单删除头部多余高价数据
        data.splice(0, data.length - maxSize);
      } else {
        // 买单删除尾部多余低价数据
        data.splice(maxSize, data.length - maxSize);
      }
    }
  }
  // 数据转换，改变入参。 eg. 价格：CNY/USD转换， 数量：张/币转换
  convertInternal(depthItem) {
    const { convertPrice, convertAmount, minAmount } = this.config;
    const price = depthItem[0];
    const amount = depthItem[1];
    if (convertPrice) {
      depthItem[0] = convertPrice({ price, amount }); // eslint-disable-line
    }
    if (convertAmount) {
      depthItem[1] = convertAmount({ price, amount }); // eslint-disable-line
      if (depthItem[1] < minAmount) {
        depthItem[1] = minAmount; // eslint-disable-line
      }
    }
  }
  // 追加数据，更新缓存
  // 注意：会将data地址赋值给内部缓存，后续修改缓存会改变入参data，为了性能不做深拷贝。
  // 若业务层需要保留原始data，请自行处理
  addDataInternal({ data, type }) {
    const isAsk = type === TYPE_ASK;
    const cacheData = isAsk ? this.askDepthCache : this.bidDepthCache;
    const { convertPrice, convertAmount } = this.config;
    // 第一次加载为空的时候
    if (cacheData.length === 0) {
      sortByPriceDesc(data);
      this.spliceMoreThanMaxInternal({ data, type });
      data.forEach((depthItem) => {
        depthItem[0] /= 1; // eslint-disable-line
        depthItem[1] /= 1; // eslint-disable-line
        this.convertInternal(depthItem);
      });
      if (isAsk) {
        this.askDepthCache = data;
      } else {
        this.bidDepthCache = data;
      }
      return data;
    }
    // 对缓存中数据进行增删改
    data.forEach((depthItem) => {
      depthItem[0] /= 1; // eslint-disable-line
      depthItem[1] /= 1; // eslint-disable-line
      if (convertPrice || convertAmount) {
        this.convertInternal(depthItem);
      }
      const price = depthItem[0];
      const amount = depthItem[1];
      // 查找该价格在缓存中的索引
      const index = cacheData.findIndex((item) => {
        return item[0] === price;
      });
      if (index !== -1) {
        // 价格存在
        if (amount > 0) {
          // 修改
          cacheData[index] = depthItem;
        } else {
          // 删除
          cacheData.splice(index, 1);
        }
      } else if (amount > 0) {
        // 价格不存在且数量大于0，则增加
        cacheData.push(depthItem);
      }
    });
    // 降序 高价 -> 低价
    sortByPriceDesc(cacheData);
    this.spliceMoreThanMaxInternal({ data: cacheData, type });
    return cacheData;
  }
  // 获取聚合后的数据
  getDepthInternal({ type, ladder, size }) {
    const isAsk = type === TYPE_ASK;
    const cacheDepth = isAsk ? this.askDepthCache : this.bidDepthCache;
    if (cacheDepth.length < 1) {
      return [];
    }
    if (ladder === 0) {
      // 0位小数ladder是1
      return cacheDepth;
    }
    // 结果数组
    const resultList = [];
    // 当前操作的档位缓存
    let depthItemCache = [];
    // 聚合后的价格标志
    let ladderValueFlag = -1;
    // 聚合档位小数位数
    // 性能比对：calc.digitLength和indexOf('.')获取小数位数性能无差异
    const ladderDigits = calc.digitLength(ladder);
    // 遍历起始位置，卖单从末端开始，买单从顶端开始
    let cacheDepthIndex = isAsk ? cacheDepth.length - 1 : 0;
    // 当前累积量
    let sum = 0;
    const cacheDepthLen = cacheDepth.length;
    // 性能比对 while和for循环，无明显差异
    for (let i = 0; i < cacheDepthLen; i++) {
      const { needSum } = this.config;
      const depthItem = cacheDepth[cacheDepthIndex];
      // 聚合后的价格
      let ladderValue;
      const depthItemPrice = depthItem[0];
      const depthItemAmount = depthItem[1];
      if (isAsk) {
        cacheDepthIndex--;
        // 卖单深度 向高位聚合
        if (ladder >= 10) {
          ladderValue = Math.ceil(calc.div(depthItemPrice, ladder)) * ladder;
        } else {
          ladderValue = calc.ceilTruncate(depthItemPrice, ladderDigits) / 1;
        }
      } else {
        cacheDepthIndex++;
        if (ladder >= 10) {
          // 买单深度 向低位聚合
          ladderValue = Math.floor(calc.div(depthItemPrice, ladder)) * ladder;
        } else {
          ladderValue = calc.floorTruncate(depthItemPrice, ladderDigits) / 1;
        }
      }

      if (ladderValueFlag != ladderValue) {
        // 与上一次聚合后价位不相等，创建新档位
        if (resultList.length == size) {
          // 达到指定个数时 停止合并
          break;
        }
        if (depthItemAmount < this.config.minAmount) {
          depthItem[1] = this.config.minAmount;
        }
        // 不能修改原始缓存中的数据
        depthItemCache = [...depthItem];
        // 将价格置为聚合后的价格
        depthItemCache[0] = ladderValue;
        // 更新最新聚合后价位
        ladderValueFlag = ladderValue;
        if (needSum) {
          sum = calc.add(sum, depthItemAmount);
          depthItemCache.push(sum);
        }
        resultList.push(depthItemCache);
      } else {
        // 与上一次聚合后价位相等
        const itemLen = depthItem.length;
        // 累加同一档位的其他元素（数量、爆仓单数量、订单数量）
        for (let j = 1; j < itemLen; j++) {
          depthItemCache[j] = ((depthItemCache[j] / 1) + (depthItem[j] / 1));
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
  // 追加数据
  addData(pushData) {
    return {
      asks: this.addDataInternal({ data: pushData.asks || [], type: TYPE_ASK }),
      bids: this.addDataInternal({ data: pushData.bids || [], type: TYPE_BID })
    };
  }

  // 获取聚合后的深度数据
  // ladder: number,  size: number
  getDepth(ladder, size) {
    return {
      asks: this.getDepthInternal({ type: TYPE_ASK, ladder, size }),
      bids: this.getDepthInternal({ type: TYPE_BID, ladder, size }),
    };
  }

  // 获取全部原始数据
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

  // 清空缓存数据
  clear() {
    this.askDepthCache = [];
    this.bidDepthCache = [];
  }

  // 更改配置
  setConfig(config) {
    this.config = {
      ...this.config,
      ...config
    };
  }
}

export default Depth;
