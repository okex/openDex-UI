import React from 'react';
import PropType from 'prop-types';
import { toLocale } from '_src/locale/react-locale';
import config from '_src/constants/Config';
import TickerWrapper from '../../wrapper/TickerWrapper';
import './FullTradeTicker.less';

const FullTradeTicker = (props) => {
  const { dataSource } = props;
  const {
    price, change, changePercentage, legalCurrency, legalPrice, dayHigh, volume, dayLow
  } = dataSource;
  const isFall = change.toString().indexOf('-') > -1;
  return (
    <div className="full-ticker">
      <div className="seg-line" />
      <div className="ticker-main">
        <span className={`${isFall ? 'primary-red' : 'primary-green'} price`}>
          {price}
        </span>
        <span className={`${isFall ? 'primary-red' : 'primary-green'} change`}>
          {changePercentage}
        </span>
      </div>
      <div className="ticker-units">
        {
          config.needLegalPrice ?
            <div className="ticker-unit">
              <div className="title">
                {toLocale('spot.ticker.legal.new', { currency: legalCurrency })}
              </div>
              <div className="value">
                {legalPrice}
              </div>
            </div> : null
        }

        <div className="ticker-unit">
          <div className="title">
            {toLocale('spot.ticker.lowest')}
          </div>
          <div className="value">
            {dayLow}
          </div>
        </div>
        <div className="ticker-unit">
          <div className="title">
            {toLocale('spot.ticker.highest')}
          </div>
          <div className="value">
            {dayHigh}
          </div>
        </div>
        <div className="ticker-unit">
          <div className="title">
            {toLocale('spot.ticker.volume')}
          </div>
          <div className="value">
            {volume}
          </div>
        </div>
      </div>
    </div>
  );
};
FullTradeTicker.propTypes = {
  dataSource: PropType.object
};
FullTradeTicker.defaultProps = {
  dataSource: {
    price: '--', // 最新价格
    change: '--', // 涨幅
    changePercentage: '--', // 涨跌幅百分比
    legalPrice: '--', // 法币价格
    dayHigh: '--', // 24小时最高价
    dayLow: '--', // 24小时最低价
    volume: '--', // 24小时成交量
    unit: '--', // 币种
    inflows: '--', // 24小时资金流入,
    outflows: '--', // 24小时资金流出,
    legalCurrency: '--',
    // tips: { toLocale('spot.ticker.inflowTips'), toLocale('spot.ticker.outflowTips')
  }
};
export default TickerWrapper(FullTradeTicker);
