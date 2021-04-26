const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');
const options = require('./options.json');

module.exports = function (source) {
  const _options = getOptions(this) || {};
  validateOptions(options, _options, 'Mock Loader');
  if (options.enable) {
    source = source.replace(/\/\/\s*@mock/g, '');
  }
  return source;
};
