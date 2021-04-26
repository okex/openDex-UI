import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import PageURL from '_src/constants/PageURL';
import { getLangURL } from '_src/utils/navigation';
import Config from '_src/constants/Config';
import './index.less';
import './index-md.less';
import './index-lg.less';
import './index-xl.less';

const Banner = () => (
  <article className="banner-container">
    <div className="banner-background">
      <div className="banner-grid">
        <section className="banner-content">
          <h1 className="title">{toLocale('home_banner_title')}</h1>
          <h2 className="title banner-subtitle ">
            {toLocale('home_banner_subtitle')}
          </h2>
          <p className="banner-paragraph">{toLocale('home_subtitle')}</p>
          <div className="button-container">
            <a
              className="button blue-button"
              href={getLangURL(PageURL.spotFullPage)}
              rel="noopener noreferrer"
              title={toLocale('home_banner_btn_trade')}
            >
              {toLocale('home_banner_btn_trade')}
            </a>
            <a
              className="button"
              href={getLangURL(Config.okexchain.receiveCoinUrl)}
              rel="noopener noreferrer"
              target="_blank"
              title={toLocale('home_receive_coin')}
            >
              {toLocale('home_receive_coin')}
            </a>
          </div>
        </section>
      </div>
    </div>
  </article>
);

export default Banner;
