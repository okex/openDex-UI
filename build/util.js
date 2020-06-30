const path = require('path');
const git = require('git-rev-sync');

const pkg = require(path.resolve(__dirname, '../package.json'));

module.exports = {
  /**
   * 获取当前版本
   */
  getVersion() {
    // 环境变量
    if (process.env.ASSETS_BUILD_VERSION) {
      return process.env.ASSETS_BUILD_VERSION;
    }

    // 根据git分支获取
    try {
      let gitVersion = git.branch(path.resolve(__dirname, '../'));
      gitVersion = gitVersion.split('/')[1] || '';
      if (/(?:\d+\.){2}\d+/.test(gitVersion)) {
        return gitVersion;
      }
    } catch (e) {
      console.log('当前项目不是git工程');
    }

    return pkg.version;
  },
  /**
   * 获取项目的带路径名字
   * http://gitlab-ci-token:4xuDNC7KTnzyPs9J7Rac@gitlab.okcoin-inc.com/okfe/okt/assets-system-test.git
   * git@gitlab.okcoin-inc.com:okfe/okt/assets-system.git
   */
  getProjectPath() {
    if (process.env.ASSETS_PROJECT_PATH) {
      return process.env.ASSETS_PROJECT_PATH;
    }
    // let remoteUrl = `okfe/${pkg.name}`;
    // try {
    //   remoteUrl = git.remoteUrl();
    // } catch (e) {
    //   //
    // }
    const remoteUrl = git.remoteUrl();
    return remoteUrl.replace(/.*okcoin-inc\.com(.*)\.git/, '$1').replace(/^[:/]/, '');
  }
};
