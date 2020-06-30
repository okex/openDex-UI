import React from 'react';
import OrderHeaderWrapper from '../../wrapper/SpotOrderHeaderWrapper';
import Enum from '../../utils/Enum';

const OrderHeader = (props) => {
  const { type, dataSource, onTabChange } = props;
  const { tradeType } = window.OK_GLOBAL;

  let headerContainerCls = '';
  if (tradeType === Enum.tradeType.normalTrade) {
    headerContainerCls = 'tab-heads';
  } else if (tradeType === Enum.tradeType.fullTrade) {
    headerContainerCls = 'full-trade-order-head';
  }

  return (
    <div className={`clear-fix ${headerContainerCls}`}>
      <ul className="tabs clear-fix">
        {/* 币币页面去掉，全屏页面保留 from PM张博 */}
        {/* {tradeType === Enum.tradeType.fullTrade ? `(${noDeal.length > 20 ? 20 : noDeal.length})` : null} */}
        {
          dataSource.map(({ type: headerType, name }) => {
            return (
              <li
                key={headerType}
                className={type === headerType ? 'active' : ''}
                onClick={onTabChange(headerType)}
              >
                {name}
              </li>
            );
          })
        }
      </ul>
      {props.children}
      {/* orderPageLink */}
    </div>
  );
};

export default OrderHeaderWrapper(OrderHeader);
