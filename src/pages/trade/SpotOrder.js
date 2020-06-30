import React from 'react';
import Enum from '../../utils/Enum';
import OrderHeader from '../spotOrders/OrderHeader';
// import OrderHeaderSecond from '../spotOrders/OrderHeaderSecond';
import OrderList from '../spotOrders/OrderList';
import './SpotOrder.less';

const SpotOrder = () => {
  const { tradeType } = window.OK_GLOBAL;
  return (
    <div className={tradeType === Enum.tradeType.normalTrade ? 'tab spot-trade-order-wrap' : 'full-tab-lists-box'}>
      {/* 表头 */}
      <OrderHeader />
      {/* 二级 */}
      {/* <OrderHeaderSecond /> */}
      {/* 订单数据 */}
      <OrderList />
    </div>
  );
};
export default SpotOrder;
