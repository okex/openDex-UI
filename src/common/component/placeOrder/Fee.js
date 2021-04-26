import React from 'react';
import PropTypes from 'prop-types';
import { toLocale } from '_src/locale/react-locale';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';

import Enum from '../../utils/Enum';

function mapStateToProps(state) {
  const { fee } = state.SpotTrade;
  return { fee };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
class Fee extends React.Component {
  static propTypes = {
    fee: PropTypes.object,
  };

  static defaultProps = {
    fee: {
      maker: '--',
      taker: '--',
    },
  };

  render() {
    const { tradeType } = window.OK_GLOBAL;
    const isFullTrade = tradeType === Enum.tradeType.fullTrade;
    const { maker, taker } = this.props.fee;
    let toolTipClass = 'tooltip-content';
    let toolTipDirection = 'bottom';
    if (isFullTrade) {
      toolTipClass = 'full-fee-tooltip';
      toolTipDirection = 'top';
    }
    const feeMT = (
      <div className={toolTipClass}>
        {toLocale('spot.fee.brokerMT', { maker, taker })}
      </div>
    );
    return (
      <Tooltip placement={toolTipDirection} overlay={feeMT}>
        <label className="detail float-right">{toLocale('spot.fee')}</label>
      </Tooltip>
    );
  }
}
export default Fee;
