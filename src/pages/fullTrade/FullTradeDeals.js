import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import Deals from '../../component/deals/Deals';
import LastestDealWrapper from '../../wrapper/LastestDealWrapper';
import './FullTradeDeals.less';

const FullTradeDeals = (props) => {
  const { dataSource, empty, columns } = props;
  return (
    <div className="full-deals">
      <div className="full-deals-title">{toLocale('spot.deals.title')}</div>
      <Deals
        dataSource={dataSource}
        columns={columns}
        empty={empty}
      />
    </div>
  );
};
export default LastestDealWrapper(FullTradeDeals);
