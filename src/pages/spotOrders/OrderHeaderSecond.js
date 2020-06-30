import React from 'react';
import SpotOrderHeaderSecondWrapper from '../../wrapper/SpotOrderHeaderSecondWrapper';
import Enum from '../../utils/Enum';

const OrderHeaderSecond = ({
  periodIntervalType, dataSource, onTabChange, extraOperations
}) => {
  return (
    <div className="full-trade-order-sec-head">
      <div>
        {extraOperations}
      </div>
      <div className="period-interval">
        {
          dataSource.map(({ type: headerType, name }, index) => {
            return (
              <div
                key={index}
                className={periodIntervalType === headerType ? 'active' : ''}
                onClick={onTabChange(headerType)}
              >
                {name}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default SpotOrderHeaderSecondWrapper(OrderHeaderSecond);
