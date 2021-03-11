import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import Tooltip from '../Tooltip';
import './WalletAddressTooltip.less';

const WalletAddressTooltip = ({
  children,
  ...props
}) => {
  const overlay = (
    <div className="depth-tooltip-content">
      {toLocale('dex_popup_tip')}
      <p className="view-detail"><a href="javascript:;">{toLocale('view_detail')}&gt;&gt;</a></p>
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
      maxWidth="256px"
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default WalletAddressTooltip;
