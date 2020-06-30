import { Component } from 'react';
import util from './utils/util';

export default class RouterCredential extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentWillMount() {
    // this.requireCredential();
  }
  // 路由校验
  requireCredential() {
    this.subAccountEmailCheck();
    const { location, localStorage } = window;
    if (util.lessThanIE11()) {
      location.href = '/pages/products/browserUpdate.html';
    }
    const token = localStorage.getItem('dex_token');
    // 已经有用户信息，直接展示，这种情况对应用户非首次打开页面
    if (token) {
      // 页面统计
      util.logRecord();
    }
  }
  // 资金管理要求加的子账户检查
  subAccountEmailCheck = () => {
    const { location, localStorage } = window;
    const subAccountUnBindEmail = (localStorage.getItem('subAccountUnBindEmail') === '1');
    const currentIsSub = (localStorage.getItem('currentIsSub') === '1');
    if (currentIsSub && subAccountUnBindEmail) {
      location.href = `/dex/account/users/security/subBindEmail/20?forward=${location.pathname}${location.search}`;
    }
  };
}
