import { calc } from '_component/okit';

export default class DepthMerge {
  constructor() {
    this.sellDepth = null;
    this.buyDepth = null;
    this.depthSymbol = null;
  }

  mergeFullSize20(data, isOverDepth001, mergeLadder) {
    let bids = [];
    let asks = [];
    if (data.bids) {
      bids = data.bids;
    }
    if (data.asks) {
      data.asks.reverse();
      asks = data.asks;
    }

    if (bids.length > 20) {
      bids.splice(20, bids.length - 20);
    }
    if (asks.length > 20) {
      asks.splice(0, asks.length - 20);
    }

    for (let k = 0; k < bids.length; k++) {
      bids[k].price = calc.floorTruncate(
        bids[k].price,
        calc.digitLength(mergeLadder)
      );
    }
    for (let k = 0; k < asks.length; k++) {
      asks[k].price = calc.ceilTruncate(
        calc.mul(Math.ceil(calc.div(asks[k].price, mergeLadder)), mergeLadder),
        calc.digitLength(mergeLadder)
      );
    }
    const newData = {
      bids,
      asks,
    };
    if (isOverDepth001) {
      const tempData = {
        bids: [],
        asks: [],
      };
      for (let i = 0; i < newData.bids.length; i++) {
        if (Number(newData.bids[i].totalSize) >= 0.001) {
          tempData.bids.push([
            newData.bids[i].price,
            calc.ceilTruncate(newData.bids[i].totalSize, 3),
          ]);
        }
      }
      for (let i = 0; i < newData.asks.length; i++) {
        if (Number(newData.asks[i].totalSize) >= 0.001) {
          tempData.asks.push([
            newData.asks[i].price,
            calc.ceilTruncate(newData.asks[i].totalSize, 3),
          ]);
        }
      }
      return tempData;
    }
    return newData;
  }
}
