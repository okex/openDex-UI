import React from 'react';
import DexTable from '_component/DexTable';
import { toLocale } from '_src/locale/react-locale';
import './DashboardSection.less';

const DashboardSection = ({
  title, columns, dataSource, rowKey, onClickMore = () => {}, isLoading = false, empty = '',
}) => {
  return (
    <section className="dashboard-section">
      <div className="ds-top">
        <h2 className="ds-title">{title}</h2>
        <span className="ds-more" onClick={onClickMore}>{toLocale('dashboard_more')}</span>
      </div>
      <DexTable
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        isLoading={isLoading}
        empty={<div>{empty}</div>}
      />
    </section>
  );
};

export default DashboardSection;
