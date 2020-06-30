import React, { Component } from 'react';
import Banner from './Banner';
import Advantage from './Advantage';
import Experience from './Experience';
import Steps from './Steps';
import './index.less';

class index extends Component {
  constructor(props) {
    super(props);
    window.okGlobal && window.okGlobal.ui && window.okGlobal.ui.setNav({
      // transparent = true 设置透明header，在非桌面端在滑动时自动根据距离判断变为透明/不透明样式，设置该参数后 header在所有尺寸都将不占高度
      transparent: true,
    });
  }

  render() {
    return (
      <main className="home-container">
        <Banner />
        <Steps />
        <Advantage />
        <Experience />
      </main>
    );
  }
}

export default index;
