const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');
const option = require('./options.json');

module.exports = function mockerLoader(source) {
  const options = getOptions(this) || {};
  validateOptions(option, options, 'Mock Loader');
  if (options.enable) {
    source = source.replace(/\/\/\s*@mock/g, '');
  }
  return source;
};
