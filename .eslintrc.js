const path = require('path');

module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    'class-methods-use-this': 0,
    'import/no-unresolved': 'off',
    'react/prop-types': 'off',
    'no-unused-expressions': 'off'
  },
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['_src', path.resolve(__dirname, './src/')],
          ['_component', path.resolve(__dirname, './src/component/')],
          ['_constants', path.resolve(__dirname, './src/constants/')],
        ],
        extensions: ['.js', '.less', '.jsx'],
      },
    },
  },
};
