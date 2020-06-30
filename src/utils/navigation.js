import PageURL from '../constants/PageURL';
import history from './history';

export const getLangURL = (url) => {
  if (/^http/i.test(url)) return url;
  return window.okGlobal.langPath + url;
};

export default {
  login: (forward = PageURL.spotFullPage) => {
    history.push(PageURL.loginPage.replace('{0}', forward));
  },
  import: () => {
    history.push(PageURL.walletImport);
  },
  register: () => {
    history.push(PageURL.walletCreate);
  },
};
