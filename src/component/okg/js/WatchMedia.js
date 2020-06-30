/*
 * @Descripttion: 监听设备类型
 * @LastEditors: 翟懿博
 */
import mediaSet from '../mediaSet';

const {
  _sm, _md, _lg, _xl
} = mediaSet;
const getResult = (media, mediaQueryEvent) => {
  let result = mediaSet[media];
  if (mediaQueryEvent && !mediaQueryEvent.matches) {
    const { preMedia } = mediaSet[media];
    result = mediaSet[`_${preMedia}`];
  }
  return result;
};

class WatchMedia {
  constructor() {
    this.fn = null;
    this.mdWatcher = window.matchMedia(_md.query);
    this.lgWatcher = window.matchMedia(_lg.query);
    this.xlWatcher = window.matchMedia(_xl.query);
  }
  _mdListener = (mediaQueryEvent) => {
    const result = getResult('_md', mediaQueryEvent);
    this.fn(result);
  };
  _lgListener = (mediaQueryEvent) => {
    const result = getResult('_lg', mediaQueryEvent);
    this.fn(result);
  };
  _xlListener = (mediaQueryEvent) => {
    const result = getResult('_xl', mediaQueryEvent);
    this.fn(result);
  };
  // 监听设备
  // boolean:runNow  是否立即执行回调，默认true
  watch(fn, { runNow = true } = {}) {
    this.fn = fn;
    this.mdWatcher.addListener(this._mdListener);
    this.lgWatcher.addListener(this._lgListener);
    this.xlWatcher.addListener(this._xlListener);
    if (runNow) {
      let result = _sm;
      if (this.xlWatcher.matches) {
        result = _xl;
      } else if (this.lgWatcher.matches) {
        result = _lg;
      } else if (this.mdWatcher.matches) {
        result = _md;
      }
      fn(result);
    }
  }
  destroy() {
    this.mdWatcher.removeListener(this._mdListener);
    this.lgWatcher.removeListener(this._lgListener);
    this.xlWatcher.removeListener(this._xlListener);
  }
}
export default WatchMedia;
