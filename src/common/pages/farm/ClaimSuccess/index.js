import React from 'react';
import { connect } from 'react-redux';
import Confirm from '../../../component/Confirm';
import { validateTxs } from '_src/utils/client';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import ConnectInfoTip from '../ConnectInfoTip';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  return { okexchainClient };
}
@connect(mapStateToProps)
export default class ClaimSuccess extends React.Component {

  constructor() {
    super();
    this.state = {
      showSuccess: false
    }
  }

  confirm = () => {
    const { okexchainClient, data } = this.props;
    const params = [data.pool_name, '', null];
    return new Promise((resolve, reject) => {
      okexchainClient.sendFarmClaimTransaction(...params)
        .then((res) => {
          resolve(res);
          if (validateTxs(res)) {
            this.state({showSuccess: true})
          }
        })
        .catch((err) => reject(err));
    });
  };

  onSuccess = () => {
    const { onClose, onSuccess } = this.props;
    if(onClose) onClose();
    if(onSuccess) onSuccess();
  }

  render() {
    const { onClose, data } = this.props;
    const { showSuccess} = this.state;
    return showSuccess ? (
      <div className="stake-panel" style={{ width: '496px' }}>
        <div className="stake-panel-title no-title">
          <span className="close" onClick={onClose}>
            ×
          </span>
        </div>
        <div className="stake-panel-content">
          <div className="infotip claim-success">
            <div className="title">
            {toLocale('You have claimed', {
              num: data.estimated_farm_dis,
            })}
            </div>
            <div className="title-tip">
            {toLocale('claimed check')}
            </div>
          </div>
        </div>
        <div className="stake-panel-footer nomargin noshadow">
          <div className="farm-btn cancel" onClick={onClose}>
            {toLocale('cancel')}
          </div>
          <div className="farm-btn" onClick={this.onSuccess}>{toLocale('Check')}</div>
        </div>
      </div>
    ):
    <Confirm
    onClick={this.confirm}
    loadingTxt={toLocale('pending transactions')}
    successTxt={toLocale('transaction confirmed')}
    exec
  ></Confirm>
  }
}

ClaimSuccess.getClaim = async ({data, onSuccess}) => {
  if (!util.isLogined()) return <ConnectInfoTip/>;
  return <ClaimSuccess data={data} onSuccess={onSuccess}/>;
};