import React from 'react';
import Icon from '_src/component/IconLite';
import './index.less';

const DexFooter = () => {
  return (
    <footer className="okdex-footer">
      <div className="row-center">©2014-2019 OKEX.com. All Rights Reserved</div>
      <div className="row-right">
        <div className="okex-footer-links">
          <a href="">
            <Icon className="icon-twitter" />
          </a>
          <div className="line-divider" />
          <a href="">
            <Icon className="icon-Telegram" />
          </a>
          <div className="line-divider" />
          <a href="">Q&A</a>
        </div>
      </div>
    </footer>
  );
};

export default DexFooter;
