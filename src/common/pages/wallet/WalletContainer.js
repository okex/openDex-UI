import React from 'react';
import './WalletContainer.less';

const WalletContainer = (props) => {
  return (
    <div className="wallet-container">
      <div className="bc-ball ball-right-top-big" />
      <div className="bc-ball ball-right-top-small" />
      <div className="bc-ball ball-left-bottom-big" />
      <div className="bc-ball ball-left-bottom-small" />
      {props.children}
    </div>
  );
};
export default WalletContainer;
