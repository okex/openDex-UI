import React from 'react';
import PropTypes from 'prop-types';
import './Deals.less';


export default class Deals extends React.Component {
  // constructor(props, context) {
  //   super(props, context);
  // }

    renderBody = () => {
      const { columns, dataSource } = this.props;
      return (
        <ul className="deals-list">
          {dataSource.map((data, index) => {
            return (
              <li key={index}>
                {columns.map((column) => {
                  if (column.render && typeof column.render === 'function') {
                    return (
                      <span key={column.key}>
                        {column.render(data[column.key], data, index)}
                      </span>
                    );
                  }
                  return (
                    <span key={column.key}>
                      {data[column.key]}
                    </span>
                  );
                })}
              </li>
              );
            })
          }
        </ul>
      );
    };

    renderEmpty = () => {
      const { empty } = this.props;
      return (
        <div style={{
            display: 'flex', justifyContent: 'center', padding: '10px', color: 'rgba(255,255,255, 0.45)'
          }}
        >
          {empty}
        </div>
      );
    };

    render() {
      const { columns, dataSource, style } = this.props;
      const haveData = dataSource && dataSource.length > 0;
      return (
        <div className="deals-rec" style={{ position: 'relative', ...style }}>
          <ul className="deals-header">
            {
              columns.map((column) => {
                  const { key, title } = column;
                  return <li key={key}>{title}</li>;
              })
            }
          </ul>
          {
            haveData ? this.renderBody() : this.renderEmpty()
          }
        </div>
      );
    }
}

Deals.defaultProps = {
  dataSource: [],
  columns: [],
  empty: {},
  style: {},
  // loading: false
};
Deals.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  empty: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  style: PropTypes.object,
  // loading: PropTypes.bool
};
