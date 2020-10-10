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

  componentWillMount() {
    const headerContainer = document.getElementById('headerContainer');
    const footerContainer = document.getElementById('footerContainer');
    if (headerContainer) headerContainer.setAttribute('style','display:block !important');
    if (footerContainer) footerContainer.setAttribute('style','display:block !important');
  }

  componentWillUnmount() {
    const headerContainer = document.getElementById('headerContainer');
    const footerContainer = document.getElementById('footerContainer');
    if (headerContainer) headerContainer.setAttribute('style','display:none');
    if (footerContainer) footerContainer.setAttribute('style','display:none');
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
