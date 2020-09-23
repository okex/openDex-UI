export default class theme {
  static getLocalTheme() {
    return localStorage.getItem('theme') || 'theme-1';
  }

  static triggerTheme() {
    this.checkDark(this.getLocalTheme() === 'theme-2');
  }

  static checkDark(hasDark) {
    localStorage.setItem('theme', hasDark ? 'theme-1' : 'theme-2');
    if (!hasDark) {
      this.importDarkTheme();
    } else {
      this.importLightTheme();
    }
  }

  static importDarkTheme() {
    document.body.classList.add('theme-2');
  }

  static importLightTheme() {
    document.body.classList.add('theme-1');
  }
}
