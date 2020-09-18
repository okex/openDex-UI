import React from 'react';
import Enum from '../../utils/Enum';
import OrderHeader from '../spotOrders/OrderHeader';
import OrderList from '../spotOrders/OrderList';
import './SpotOrder.less';

const SpotOrder = () => {
  const { tradeType } = window.OK_GLOBAL;
  return (
    <div
      className={
        tradeType === Enum.tradeType.normalTrade
          ? 'tab spot-trade-order-wrap'
          : 'full-tab-lists-box'
      }
    >
      <OrderHeader />
      <OrderList />
    </div>
  );
};
export default SpotOrder;
