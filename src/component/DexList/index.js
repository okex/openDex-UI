import React, { Component } from 'react';
import DexTable from '_component/DexTable';
import Pagination from '_component/Pagination';
import { isFunction } from '_src/utils/type';
import './index.less';

class DexList extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      title, tool,
      columns, dataSource, rowKey, isLoading, empty,
      total, page, pageSize, onChange,
    } = this.props;

    return (
      <div className="dex-list-container">
        <div className="dex-list-top">
          {
            isFunction(title) ? (
              <div className="dex-list-title-container">{title()}</div>
            ) : (
              <div className="dex-list-title">{title}</div>
            )
          }
        </div>
        {
          isFunction(tool) && (
            <div className="dex-list-tool-container">{tool()}</div>
          )
        }
        <DexTable
          columns={columns}
          dataSource={dataSource}
          rowKey={rowKey}
          isLoading={isLoading}
          empty={<div>{empty}</div>}
        />
        {
          total > 0 && (
            <div className="dex-list-pagination-container">
              <Pagination
                className="dex-list-pagination"
                total={total}
                pageSize={pageSize}
                onChange={onChange}
                current={page}
                hideOnSinglePage={false}
                dark
              />
            </div>
          )
        }
      </div>
    );
  }
}

export default DexList;
