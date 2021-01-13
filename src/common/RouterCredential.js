import { Component } from 'react';
import util from './utils/util';
import env from '../common/constants/env';

export default class RouterCredential extends Component {
  requireCredential() {
    this.subAccountEmailCheck();
    const { location, localStorage } = window;
    if (util.lessThanIE11()) {
      location.href = '/pages/products/browserUpdate.html';
    }
    const token = localStorage.getItem(env.envConfig.dexToken);
    if (token) {
      util.logRecord();
    }
  }
  subAccountEmailCheck = () => {
    const { location, localStorage } = window;
    const subAccountUnBindEmail =
      localStorage.getItem('subAccountUnBindEmail') === '1';
    const currentIsSub = localStorage.getItem('currentIsSub') === '1';
    if (currentIsSub && subAccountUnBindEmail) {
      location.href = `/dex/account/users/security/subBindEmail/20?forward=${location.pathname}${location.search}`;
    }
  };
}
