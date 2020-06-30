import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_src/constants/PageURL';
import IconLite from '_src/component/IconLite';
import Config from '_src/constants/Config';
import Image from '../image';
import './index.less';
import './index-md.less';
import './index-lg.less';
import './index-xl.less';

const Experience = () => {
  return (
    <article className="experience-grid">
      <section className="top">
        <div className="top-content">
          <h2 className="experience-title">{toLocale('home_exp_title')}</h2>
          <p className="experience-content">{toLocale('home_exp_content')}</p>
          <a
            className="button blue-button"
            href={getLangURL(Config.okchain.receiveCoinUrl)}
            target="_blank"
            rel="friend"
            title={toLocale('home_receive_coin')}
          >
            {toLocale('home_receive_coin')}
          </a>
        </div>
        <img
          className="experience-img"
          src={toLocale('home_exp_img') || Image.exp}
          alt={toLocale('home_exp_title')}
        />
      </section>
      <section className="bottom">
        <div className="bottom-content">
          <h3 className="more-title">{toLocale('home_exp_more')}</h3>
          <a
            className="more-button"
            href={Config.okchain.docUrl}
            target="_blank"
            rel="friend"
            title={toLocale('home_exp_more')}
          >
            <IconLite className="icon-icon_document" />
            {toLocale('home_step5_title')}
          </a>
        </div>
      </section>
    </article>
  );
};

export default Experience;
