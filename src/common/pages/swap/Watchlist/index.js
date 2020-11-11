import React from 'react';
import classNames from 'classnames';
import DataRow from './DataRow';
const ASC = 'asc';
const DESC = 'desc';
export default class Watchlist extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  getHead() {
    const { columns } = this.props;
    return columns.map((d, index) => {
      const name = typeof d.name === 'function' ? d.name() : d.name;
      return (
        <td width={d.width} key={index}>
          <div className={classNames({ 'head-sort': d.canSort })}>
            {name}
            {d.canSort && (
              <div>
                <i
                  className={classNames('up', {
                    active: this.isFieldSort(d, ASC),
                  })}
                  onClick={() => this.sortField(d, ASC)}
                />
                <i
                  className={classNames('down', {
                    active: this.isFieldSort(d, DESC),
                  })}
                  onClick={() => this.sortField(d, DESC)}
                />
              </div>
            )}
          </div>
        </td>
      );
    });
  }

  sortField(column, _sort) {
    if (this.isFieldSort(column, _sort)) return;
    this.props.onSort({ field: column.field, sort: _sort });
  }

  isFieldSort(column, _sort) {
    const { sort } = this.props;
    if (!sort) return false;
    return column.field === sort.field && _sort === sort.sort;
  }

  render() {
    const { data, columns, children } = this.props;
    return (
      <>
        <table>
          <tbody>
            <tr className="table-head">{this.getHead()}</tr>
            {data.map((d, index) => (
              <DataRow key={index} data={d} columns={columns} />
            ))}
          </tbody>
        </table>
        {children}
      </>
    );
  }
}
