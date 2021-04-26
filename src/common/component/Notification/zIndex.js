const _globalThis = (function getGlobalThis() {
  let res;
  if (typeof window !== 'undefined') {
    res = window;
  } else if (typeof global !== 'undefined') {
    res = global;
  } else {
    throw new Error('unable to locate global object');
  }
  res.addEventListener = res.addEventListener || function addEventListener() {};
  return res;
})();

const scope = {
  init() {
    if (!_globalThis.okd) _globalThis.okd = {};
  },
  set(k, v) {
    this.init();
    _globalThis.okd[k] = v;
  },
  get(k) {
    this.init();
    return _globalThis.okd[k];
  },
};

export const zIndexFlag = 'zIndexFlag';

/**
 * 全局z-index生成器，保证弹出框总为最大
 *
 * todo: 应代理设置z-index的过程，提供全局在用z-index信息
 *  这样就可以做一些无在用复位，无可用扩充，统一管理全局定位dom的操作
 *
 * @param {*} dom
 * @returns
 */
export const zIndexGenerator = (() => {
  const INIT_VALUE = 10000;
  const MOST_VALUE = 20000;
  function next(most) {
    let value = scope.get(zIndexFlag) || INIT_VALUE;
    if (most) value = MOST_VALUE;
    if (!most) scope.set(zIndexFlag, value + 1);
    return { value };
  }
  return {
    next,
  };
})();
