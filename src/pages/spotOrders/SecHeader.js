import React from 'react';
import OrderSecHeaderWrapper from '../../wrapper/SpotOrderSecHeaderWrapper';
import Enum from '../../utils/Enum';

const SecHeader = ({ entrustType, dataSource, onEntrustTypeChange }) => {
  const {
    tradeType, webType, webTypes
  } = window.OK_GLOBAL;
  const isKr = webType === webTypes.OKKr;
  if (isKr || tradeType === Enum.tradeType.fullTrade) {
    return <div />;
  }
  return (
    <div className="types-line">
      <ul>
        {
          dataSource.map(({ type, name }) => {
            return (
              <li
                className={`type-btn ${entrustType === type ? 'current' : ''}`}
                onClick={onEntrustTypeChange(type)}
                key={type}
              >
                {name}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default OrderSecHeaderWrapper(SecHeader);
