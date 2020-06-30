import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import Tooltip from '../Tooltip';

import './DepthTooltip.less';


const DepthTooltip = ({
  tooltipAvg, tooltipTotal, tooltipSum, children, symbol = '_', ...props
}) => {
  const [token, base] = symbol.toUpperCase().split('_');
  const trade = token.split('-')[0];
  const overlay = (
    <div className="depth-tooltip-content">
      <div><label>{toLocale('spot.depth.tooltip.sumTrade', { trade })}:</label><span>{tooltipSum}</span></div>
      <div><label>{toLocale('spot.depth.tooltip.sumBase', { base })}:</label><span>{tooltipTotal}</span></div>
      <div><label>{toLocale('spot.depth.tooltip.avgPrice')}:</label><span>{tooltipAvg}</span></div>
    </div>
  );
  return (
    <Tooltip
      hasArrow
      hasShadow
      noWrapper
      mouseLeaveDelay={0}
      placement="left"
      overlay={overlay}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default DepthTooltip;
