import React from 'react';
import PropTypes from 'prop-types';
import Loading from '_component/Loading';
import './index.less';

export default class Table extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    empty: PropTypes.object,
    rowKey: PropTypes.string,
    isLoading: PropTypes.bool,
    theme: PropTypes.string,
  };
  static defaultProps = {
    style: {},
    dataSource: [],
    columns: [],
    empty: {},
    rowKey: 'key',
    isLoading: false,
    theme: '',
  };
  renderTbody = () => {
    const { columns, dataSource, rowKey } = this.props;
    return (
      <tbody>
        {dataSource.map((data, index) => {
          return (
            <tr key={data[rowKey]}>
              {columns.map((column) => {
                if (column.render && typeof column.render === 'function') {
                  return (
                    <td key={column.key}>
                      {column.render(data[column.key], data, index)}
                    </td>
                  );
                }
                return <td key={column.key}>{data[column.key]}</td>;
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
      <div style={style}>
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '27px' }}
        >
          {empty}
        </div>
      </div>
    );
  };
  render() {
    const { columns, dataSource, style, isLoading, theme } = this.props;
    const { isLogin } = window.OK_GLOBAL;
    const haveData = dataSource && dataSource.length > 0;
    const themeClassName = theme === 'dark' ? ' ok-table-dark-theme' : '';
    return (
      <div
        className={`ok-table-container${themeClassName}`}
        style={{ position: 'relative', ...style }}
      >
        <Loading when={isLogin && isLoading} theme={theme} />
        <table className="ok-table">
          <thead>
            <tr>
              {columns.map((column) => {
                const { key, title } = column;
                return <th key={key}>{title}</th>;
              })}
            </tr>
          </thead>
          {haveData ? this.renderTbody() : null}
        </table>
        {this.props.children}
        {haveData ? null : this.renderEmpty()}
      </div>
    );
  }
}
