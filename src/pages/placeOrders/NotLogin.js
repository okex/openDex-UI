import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import { Button } from '_component/Button';
import navigation from '../../utils/navigation';
import Enum from '../../utils/Enum';
import './NotLogin.less';

export default () => {
  const { tradeType } = window.OK_GLOBAL;
  return (
    <div className={`place-order-not-login ${tradeType === Enum.tradeType.fullTrade ? 'dark' : 'flex10'}`}>
      <div className="header">{toLocale('spot.notlogin.tradenow')}</div>
      <div className="main">
        {/* site以前传okex or okcoin，但是为了兼容各种券商，去掉站点名称 */}
        <p>{toLocale('spot.notlogin.preview', { site: '' })}</p>
        <div className="btns">
          <Button
            type={Button.btnType.primary}
            size={Button.size.large}
            circle
            onClick={() => { navigation.login(); }}
          >
            {toLocale('login')}
          </Button>
          <Button
            type={Button.btnType.default}
            size={Button.size.large}
            circle
            onClick={() => { navigation.register(); }}
            style={{ background: 'none' }}
          >
            {toLocale('signUp')}
          </Button>
        </div>
      </div>
    </div>
  );
};
