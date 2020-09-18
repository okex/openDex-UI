import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import Icon from '_src/component/IconLite';
import PageURL from '_src/constants/PageURL';
import Config from '_src/constants/Config';
import './index.less';

const index = () => {
  return (
    <div className="home-container-inner">
      <div className="home-header">
        <div className="home-header-right">
          <img
            src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/AD222BAF06543BE0DB6E0A96DDC583F7.png"
            width={844}
            height={400}
          />
        </div>
        <div className="home-header-left">
          <img
            src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/D4592142474E53DC42541273C4DDA1B5.png"
            width={300}
            height={286}
          />
        </div>
        <h1>{toLocale('home_title')}</h1>
        <h3>{toLocale('home_subtitle')}</h3>
        <div className="home-btn-group">
          <a
            href={PageURL.spotFullPage}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <Icon className="icon-trade" />
              <span>{toLocale('home_begin_trade_btn')}</span>
            </span>
            <Icon className="icon-go" />
          </a>
          <a
            className="div2"
            href={PageURL.walletCreate}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <Icon className="icon-create" />
              <span>{toLocale('home_create_wallet_btn')}</span>
            </span>
            <Icon className="icon-go" />
          </a>
          <a
            className="div2"
            href={PageURL.walletImport}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <Icon className="icon-wallet1" />
              <span>{toLocale('home_import_wallet_btn')}</span>
            </span>
            <Icon className="icon-go" />
          </a>
          <a
            className="div2"
            href={Config.okexchain.browserUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <Icon className="icon-Browser" />
              <span>{toLocale('home_browser')}</span>
            </span>
            <Icon className="icon-go" />
          </a>
          <a
            className="div3"
            href={Config.okexchain.docUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <Icon className="icon-help" />
              <span href={Config.okexchain.docUrl}>
                {toLocale('home_instructions')}
              </span>
            </span>
            <Icon className="icon-go" />
          </a>
        </div>
      </div>
      <div className="home-body">
        <h2>{toLocale('home_how_use')}</h2>
        <div className="how-to-container">
          <div className="step-container">
            <img
              src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/382EC444F5ED5F9C50DD06A6D65ED150.png"
              alt="num-1"
              width={48}
              height={48}
            />
            <span>{toLocale('home_step1_title')}</span>
          </div>
          <div className="desc-container">
            <ul>
              <li>{toLocale('home_step1_li1')}</li>
              <li>{toLocale('home_step1_li2')}</li>
              <li>{toLocale('home_step1_li3')}</li>
            </ul>
            <a
              href={PageURL.walletCreate}
              target="_blank"
              rel="noopener noreferrer"
            >
              {toLocale('home_step1_btn')}
              <img src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/130407AC319D1D7DB4B7EAD09D83016C.png" />
            </a>
          </div>
        </div>
        <div className="how-to-container">
          <div className="step-container">
            <img
              src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/754582E0858D40E1AA5541F4AC50BF85.png"
              alt="num-2"
              width={48}
              height={48}
            />
            <span>{toLocale('home_step2_title')}</span>
          </div>
          <div className="desc-container">
            <ul>
              <li>{toLocale('home_step2_li1')}</li>
              <li>{toLocale('home_step2_li2')}</li>
              <li>{toLocale('home_step2_li3')}</li>
            </ul>
            <a
              href={Config.okexchain.receiveCoinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {toLocale('home_step2_btn')}
              <img src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/130407AC319D1D7DB4B7EAD09D83016C.png" />
            </a>
          </div>
        </div>
        <div className="how-to-container">
          <div className="step-container">
            <img
              src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/92C0DA26E463944FEE42BA6930AE8BCD.png"
              alt="num-3"
              width={48}
              height={48}
            />
            <span>{toLocale('home_step3_title')}</span>
          </div>
          <div className="desc-container">
            <ul>
              <li>{toLocale('home_step3_li1')}</li>
              <li>{toLocale('home_step3_li2')}</li>
            </ul>
            <a
              href={PageURL.spotFullPage}
              target="_blank"
              rel="noopener noreferrer"
            >
              {toLocale('home_step3_btn')}
              <img src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/130407AC319D1D7DB4B7EAD09D83016C.png" />
            </a>
          </div>
        </div>
        <div className="how-to-container">
          <div className="step-container">
            <img
              src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/831414284D0C7E47AF223D99E574458F.png"
              alt="num-4"
              width={48}
              height={48}
            />
            <span>{toLocale('home_step4_title')}</span>
          </div>
          <div className="desc-container">
            <ul>
              <li>{toLocale('home_step4_li1')}</li>
            </ul>
            <a
              href={Config.okexchain.browserUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {toLocale('home_step4_btn')}
              <img src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/130407AC319D1D7DB4B7EAD09D83016C.png" />
            </a>
          </div>
        </div>
        <div className="how-to-container">
          <div className="step-container">
            <img
              src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/F40D61AE8D4EDF6B5440F74FC759F37E.png"
              alt="num-5"
              width={48}
              height={48}
            />
            <span>{toLocale('home_step5_title')}</span>
          </div>
          <div className="desc-container">
            <ul>
              <li>{toLocale('home_step5_li1')}</li>
            </ul>
            <a
              href={Config.okexchain.docUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {toLocale('home_step5_btn')}
              <img src="https://img.bafang.com/cdn/assets/imgs/MjAxOTEx/130407AC319D1D7DB4B7EAD09D83016C.png" />
            </a>
          </div>
        </div>
      </div>
      <div className="okex-logo">
        <Icon className="icon-testcoin" isColor />
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={Config.okexchain.receiveCoinUrl}
        >
          {toLocale('home_receive_coin')} &gt;&gt;
        </a>
      </div>
    </div>
  );
};

export default index;
