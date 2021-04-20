import env from '../../../constants/env';

const SWAP_SITTING_STOREKEY = env.envConfig.swapSetting;
const SWAP_LIQUIDITY_STOREKEY = env.envConfig.liquidityCheck;
const SWSWAP_SETTING_Default = {
  slippageTolerance: 0.5,
};

export function getSetting() {
  const store = window.localStorage.getItem(SWAP_SITTING_STOREKEY);
  if (!store) return SWSWAP_SETTING_Default;
  try {
    const data = JSON.parse(store);
    return { ...SWSWAP_SETTING_Default, ...data };
  } catch (e) {
    console.log(e);
  }
  return SWSWAP_SETTING_Default;
}

export function setting(data) {
  window.localStorage.setItem(SWAP_SITTING_STOREKEY, JSON.stringify(data));
}

export function getDeadLine4sdk() {
  return `${parseInt(Date.now() / 1000) + 94608000000}`;
}

export function getLiquidityCheck() {
  const store = window.localStorage.getItem(SWAP_LIQUIDITY_STOREKEY);
  return !!store;
}

export function liquidityCheck(data = '') {
  window.localStorage.setItem(SWAP_LIQUIDITY_STOREKEY, data);
}
