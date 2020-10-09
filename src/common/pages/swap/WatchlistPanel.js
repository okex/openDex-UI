import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WatchlistPanel extends React.Component {

  render() {
    return (
      <div>
        Watchlist
      </div>
    );
  }
}
