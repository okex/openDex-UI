import React from 'react';

export default class Dialog extends React.Component {

  constructor() {
    super();
  }

  render() {
    const {title} = this.props;
    return (
      <>
      <div className="farm-dialog">
        <i className="farm-dialog-close"></i>
        {title && <div className="farm-dialog-title">{title}</div>}
      </div>
      </>
    );
  }
}
