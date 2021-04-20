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
    hidePage: PropTypes.bool,
    pagination: PropTypes.object,
    onPageChange: PropTypes.func,
    hideOnSinglePage: PropTypes.bool,
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
      page: 1,
      total: 0,
      per_page: 20,
    },
    onPageChange: () => {},
    hideOnSinglePage: true,
  };

  renderTbody = () => {
    const { columns, dataSource, rowKey } = this.props;
    return (
      <tbody>
        {dataSource.map((data, index) => (
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
        ))}
      </tbody>
    );
  };

  renderEmpty = () => {
    const { empty, style } = this.props;
    return (
      <div style={style} className="dex-table-empty">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '27px',
            marginTop: '33px',
          }}
        >
          {empty}
        </div>
      </div>
    );
  };

  render() {
    const {
      columns,
      dataSource,
      style,
      isLoading,
      hidePage,
      pagination,
      onPageChange,
      hideOnSinglePage,
    } = this.props;
    const { page, per_page, total, totalSize } = pagination;
    const { isLogin } = window.OK_GLOBAL;
    const haveData = dataSource && dataSource.length > 0;
    return (
      <div
        className="dex-table-container"
        style={{ position: 'relative', ...style }}
      >
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
                return (
                  <th key={key} style={thStyle}>
                    {title}
                  </th>
                );
              })}
            </tr>
          </thead>
          {haveData ? this.renderTbody() : null}
        </table>
        {haveData ? null : this.renderEmpty()}
        {hidePage || total === 0 || totalSize === 0 ? null : (
          <div className="page-container">
            <Pagination
              current={page}
              pageSize={per_page}
              total={total || totalSize}
              onChange={onPageChange}
              hideOnSinglePage={hideOnSinglePage}
              dark
            />
          </div>
        )}
      </div>
    );
  }
}
