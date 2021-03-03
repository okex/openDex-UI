import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import Tooltip from '../Tooltip';

import './WalletAddressTooltip.less';

const WalletAddressTooltip = ({
  tooltipAvg,
  tooltipTotal,
  tooltipSum,
  children,
  symbol = '_',
  ...props
}) => {
  const [token, base] = symbol.toUpperCase().split('_');
  const trade = token.split('-')[0];
  const overlay = (
    <div className="depth-tooltip-content">
      每周五将会发放鼓励金至“待领取鼓励金”，您可以在鼓励金发放后在此领取。鼓励金被领取后将会进入您的资金账户。
      <p><a href="javascript:;">查看详情&gt;&gt;</a></p>
      {/* <div>
        <label>{toLocale('spot.depth.tooltip.sumTrade', { trade })}:</label>
        <span>{tooltipSum}</span>
      </div>
      <div>
        <label>{toLocale('spot.depth.tooltip.sumBase', { base })}:</label>
        <span>{tooltipTotal}</span>
      </div>
      <div>
        <label>{toLocale('spot.depth.tooltip.avgPrice')}:</label>
        <span>{tooltipAvg}</span>
      </div> */}
    </div>
  );
  return (
    <Tooltip
      hasArrow
      hasShadow
      noWrapper
      mouseLeaveDelay={0}
      placement="right"
      overlay={overlay}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default WalletAddressTooltip;
