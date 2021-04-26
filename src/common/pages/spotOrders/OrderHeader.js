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
        {dataSource.map(({ type: headerType, name }) => (
          <li
            key={headerType}
            className={type === headerType ? 'active' : ''}
            onClick={onTabChange(headerType)}
          >
            {name}
          </li>
        ))}
      </ul>
      {props.children}
    </div>
  );
};

export default OrderHeaderWrapper(OrderHeader);
