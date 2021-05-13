const path = require('path');

const staticLocalPath = 'http://127.0.0.1:5300/dex/swap';
const staticBundlePath = `file://${path.resolve(__dirname, './bundle')}`;
const staticHtmlPath = 'http://okexchain/dex/swap';

module.exports = {
  staticLocalPath,
  staticBundlePath,
  staticHtmlPath,
  locale: {
    staticPath: staticLocalPath,
  },
  develope: {
    staticPath: staticHtmlPath,
  },
  prod: {
    staticPath: staticHtmlPath,
  },
  isOkexchainUrl(url) {
    return /^(http:\/\/okexchain)/.test(url);
  },
};
