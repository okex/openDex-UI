import React from 'react';

export default class DataRow extends React.Component {
  render() {
    const { data, columns } = this.props;
    return (
      <tr>
        {columns.map((d, index) => {
          const Component = d.component;
          const { field } = d;
          if (!Component) return <td key={index}>{data[field]}</td>;
          return (
            <td key={index}>
              <Component index={index} data={data[field]} row={data} />
            </td>
          );
        })}
      </tr>
    );
  }
}
