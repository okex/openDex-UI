import env from '_src/constants/env';
import React from 'react';
import information from '_src/assets/images/Information.svg';
import { toLocale } from '_src/locale/react-locale';
import Config from '_src/constants/Config';
import './index.less';

export default function AddressTip() {
  const pathType = window.localStorage.getItem(env.envConfig.mnemonicPathType);
  if (pathType === 'new') return null;
  return (
    <div className="wallet-main">
      <div className="top-tip">
        <img src={information} alt="" />
        <p>{toLocale('dex_top_tip')}</p>
        <a onClick={() => window.open(Config.okexchain.doubleAddress)}>
          {toLocale('for_details')}
        </a>
      </div>
    </div>
  );
}
