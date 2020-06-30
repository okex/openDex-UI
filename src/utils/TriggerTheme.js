export default class theme {
  // 查询本地是否存有theme
  static getLocalTheme() {
    return localStorage.getItem('theme') || 'theme-1';
  }

  // 动态加载主题
  static triggerTheme() {
    this.checkDark(this.getLocalTheme() === 'theme-2');
  }

  // 切换主题
  static checkDark(hasDark) {
    localStorage.setItem('theme', hasDark ? 'theme-1' : 'theme-2');
    if (!hasDark) {
      // 切到dark 添加dark_theme
      this.importDarkTheme();
    } else {
      // 默认light
      this.importLightTheme();
    }
  }

  static importDarkTheme() {
    // document.body.setAttribute('class', 'theme-2');
    document.body.classList.add('theme-2');
  }

  static importLightTheme() {
    // document.body.setAttribute('class', 'theme-1');
    document.body.classList.add('theme-1');
  }
}
