
import util from '../utils/util';

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

const env = {
  get envConfig() {
    let { pathname, hash } = util.getPathAndHash();
    if(/^\/dex\-test/.test(pathname) || /^\/dex\-test/.test(hash)) return testnet; 
    return mainnet;
  }
}

export default env;
