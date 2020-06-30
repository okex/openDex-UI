// 全屏深度背景条
const DepthBar = {
  sort(depth) {
    depth.sort((a, b) => { return a.amount.replace(/,/g, '') - b.amount.replace(/,/g, ''); });
    return depth;
  },

  median(depth) {
    const i = Math.floor(depth.length * 2 / 3);
    if (!depth[i]) {
      return 1;
    }
    const result = depth[i].amount.replace(/,/g, '');
    return Math.max(1, result);
  },

  medianUnit(bids, asks) {
    return this.median(this.sort(bids.concat(asks)));
  },

  width(amount, medianUnit) {
    if (Number(medianUnit) === 0) {
      return 1;
    }
    // (数量/平均数量) * 总长度的50%
    return Math.round(amount.replace(/,/g, '') / medianUnit * 50);
  }
};

export default DepthBar;
