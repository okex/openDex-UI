import React from 'react';
import './index.less';

const index = ({ tabs = [], current, onChangeTab, optional = null }) => {
  return (
    <div className="dex-tab">
      {tabs.map(({ id, label }) => {
        return (
          <div
            key={id}
            className={`dex-tab-item${current === id ? ' current' : ''}`}
            onClick={onChangeTab(id)}
          >
            {label}
          </div>
        );
      })}
      {optional}
    </div>
  );
};

export default index;
