process.env.NODE_ENV = 'production';

module.exports = {
  NODE_ENV: JSON.stringify('production'),
  ASSETS_BUILD_TYPE: JSON.stringify(process.env.ASSETS_BUILD_TYPE),
};
