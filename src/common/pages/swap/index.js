import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.less';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Swap extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        111111
      </div>
    );
  }
}
