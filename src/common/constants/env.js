
import {getPathAndHash} from '../utils/util';

const testnet = {
  apiPath: 'okexchaintestnet',
  pagePath: 'dex-test',
  chainId: 'okexchaintestnet-1',
  pushLogin: ''
};

const mainnet = {
  apiPath: 'okexchain',
  pagePath: 'dex',
  chainId: 'okexchain-1',
  pushLogin: ''
}

export default {
  get envConfig() {
    let { pathname, hash } = getPathAndHash();
    if(pathname.test(/\/dex/) || hash.test(/\/dex/)) return mainnet; 
    return testnet;
  }
}
