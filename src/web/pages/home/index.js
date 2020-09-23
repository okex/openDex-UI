import React, { Component } from 'react';
import Banner from './Banner';
import Advantage from './Advantage';
import Experience from './Experience';
import Steps from './Steps';
import './index.less';

class index extends Component {
  constructor(props) {
    super(props);
    window.okGlobal &&
      window.okGlobal.ui &&
      window.okGlobal.ui.setNav({
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
