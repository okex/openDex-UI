import React from 'react';
import './index.less';

/**
 * tab组件
 * @param tabs tab数组，格式[{ id: 1, label: 'tab1' }, { id: 2, label: 'tab2' }]
 * @param current 当前tab的id
 * @param onChangeTab 点击tab
 * @param optional 额外的元素，如操作等
 * @returns {*}
 */
const index = ({
  tabs = [], current, onChangeTab, optional = null
}) => {
  return (
    <div className="dex-tab">
      {
        tabs.map(({ id, label }) => {
          return <div key={id} className={`dex-tab-item${current === id ? ' current' : ''}`} onClick={onChangeTab(id)}>{label}</div>;
        })
      }
      {optional}
    </div>
  );
};

export default index;
