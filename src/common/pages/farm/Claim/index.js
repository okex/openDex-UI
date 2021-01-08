import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import Confirm from '../../../component/Confirm';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  return { okexchainClient };
}

@connect(mapStateToProps)
export default class Stake extends React.Component {
  confirm = () => {
    const { okexchainClient, data } = this.props;
    const params = [data.pool_name, '', null];
    return okexchainClient.sendSwapTokenTransaction(...params);
  };

  render() {
    const { data, onClose } = this.props;
    return (
      <div className="stake-panel">
        <div className="stake-panel-title">
          {toLocale('Claim details')}
          <span className="close" onClick={onClose}>
            ×
          </span>
        </div>
        <div className="stake-panel-content">
          <div className="stake-panel-table">
            <table>
              <tbody>
                <tr className="thead">
                  <td width="153">{toLocale('Token')}</td>
                  <td>{toLocale('Claimed')}</td>
                  <td width="150">{toLocale('Unclaimed')}</td>
                </tr>
                {data.farmed_details.map((d, index) => (
                  <tr key={index}>
                    <td>{d.symbol_dis}</td>
                    <td>{d.claimed_dis}</td>
                    <td>{d.unclaimed_dis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="stake-panel-footer nomargin">
          <Confirm
            onClick={this.confirm}
            loadingTxt={toLocale('pending transactions')}
            successTxt={toLocale('transaction confirmed')}
          >
            <div className="farm-btn">{toLocale('OK')}</div>
          </Confirm>
        </div>
      </div>
    );
  }
}
