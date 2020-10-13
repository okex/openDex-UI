const SWAP_SITTING_STOREKEY = 'swap_setting_config';
const SWSWAP_SETTING_Default ={
  slippageTolerance: 0.5,
  transactionDeadline: 1,
}

export function getSetting() {
  const store = window.localStorage.getItem(SWAP_SITTING_STOREKEY);
  if(!store) return SWSWAP_SETTING_Default;
  try {
    const data = JSON.parse(store);
    return {...SWSWAP_SETTING_Default,...data};
  } catch(e) {
    console.log(e);
  }
  return SWSWAP_SETTING_Default; 
}

export function setting(data) {
  window.localStorage.setItem(SWAP_SITTING_STOREKEY,JSON.stringify(data));
}