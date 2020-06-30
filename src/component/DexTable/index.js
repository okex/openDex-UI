/**
 * Dex Table
 * Created by hongguang.wang on 2019-04-25.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Loading from '_component/Loading';
import Pagination from '_component/Pagination';
import './index.less';

export default class Table extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    empty: PropTypes.object,
    rowKey: PropTypes.string,
    isLoading: PropTypes.bool,
    hidePage: PropTypes.bool, // 是否隐藏分页组件
    pagination: PropTypes.object, // 分页组件数据object
    onPageChange: PropTypes.func, // 分页变化函数
  };
  static defaultProps = {
    style: {},
    dataSource: [],
    columns: [],
    empty: null,
    rowKey: 'key',
    isLoading: false,
    hidePage: false,
    pagination: {
      page: 1, // 当前页码
      total: 0, // 数据总条数
      per_page: 20, // 每页条数
    },
    onPageChange: () => {}, // 页码变化回调
  };

  renderTbody = () => {
    const { columns, dataSource, rowKey } = this.props;
    return (
      <tbody>
        {dataSource.map((data, index) => {
        return (
          <tr key={data[rowKey]}>
            {columns.map((column) => {
              const { render, key, alignRight } = column;
              const tdStyle = {};
              if (alignRight) {
                tdStyle.textAlign = 'right';
              }
              if (render && typeof render === 'function') {
                return (
                  <td key={key} style={tdStyle}>
                    {column.render(data[key], data, index)}
                  </td>
                );
              }
              return (
                <td key={key} style={tdStyle}>
                  {data[key]}
                </td>
              );
            })}
          </tr>
        );
      })}
      </tbody>
    );
  };
  renderEmpty = () => {
    const { empty, style } = this.props;
    return (
      <div style={style} className="dex-table-empty">
        <div style={{
           display: 'flex', justifyContent: 'center', padding: '27px', marginTop: '33px'
          }}
        >
          {empty}
        </div>
      </div>
    );
  };

  render() {
    const {
      columns, dataSource, style, isLoading, hidePage, pagination, onPageChange
    } = this.props;
    const {
      page, per_page, total, totalSize
    } = pagination;
    const { isLogin } = window.OK_GLOBAL;
    const haveData = dataSource && dataSource.length > 0;
    return (
      <div className="dex-table-container" style={{ position: 'relative', ...style }}>
        <Loading when={isLogin && isLoading} />
        <table className="dex-table">
          <thead>
            <tr>
              {columns.map((column) => {
              const { key, title, alignRight } = column;
              const thStyle = {};
              if (alignRight) {
                thStyle.textAlign = 'right';
              }
              return <th key={key} style={thStyle}>{title}</th>;
            })}
            </tr>
          </thead>
          {
            haveData ? this.renderTbody() : null
          }
        </table>
        {haveData ? null : this.renderEmpty()}
        {hidePage || total === 0 || totalSize === 0 ? null : (
          <div className="page-container">
            <Pagination
              current={page}
              pageSize={per_page}
              total={total || totalSize}
              onChange={onPageChange}
              dark
            />
          </div>
        )}
      </div>
    );
  }
}
