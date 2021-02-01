import React from 'react';
import { Dialog } from '../../../component/Dialog';
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
export default class ClaimBtn extends React.Component {
  constructor() {
    super();
    this.confirmRef = React.createRef();
    this.state = {
      show: false,
      triggerClick: false,
    };
  }

  confirm = () => {
    const { okexchainClient, data } = this.props;
    const params = [data.pool_name, '', null];
    return new Promise((resolve, reject) => {
      okexchainClient
        .sendFarmClaimTransaction(...params)
        .then((res) => {
          resolve(res);
          if (validateTxs(res)) {
            this.setState({ show: true });
          }
        })
        .catch((err) => reject(err));
    });
  };

  onClose = () => {
    this.setState({ show: false, triggerClick: false });
  };

  onSuccess = () => {
    const { onSuccess } = this.props;
    this.onClose();
    if (onSuccess) onSuccess();
  };

  createBtn() {
    const { children, disabled } = this.props;
    const child = React.Children.only(children);
    const { onClick } = child.props;
    return React.cloneElement(child, {
      onClick: async () => {
        if (disabled || (onClick && (await onClick()) === false)) return;
        this.onClick();
      },
    });
  }

  onClick = async () => {
    this.setState({ triggerClick: true });
    util.isLogined() && this.confirmInstance && this.confirmInstance._onClick();
  };

  getRender = () => {
    const { data } = this.props;
    const { show, triggerClick } = this.state;
    if (!triggerClick) return null;
    if (!util.isLogined())
      return (
        <Dialog visible hideCloseBtn>
          <ConnectInfoTip onClose={this.onClose} />
        </Dialog>
      );
    if (show)
      return (
        <Dialog visible hideCloseBtn>
          <div className="stake-panel" style={{ width: '496px' }}>
            <div className="stake-panel-title no-title">
              <span className="close" onClick={this.onClose}>
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
                <div className="title-tip">{toLocale('claimed check')}</div>
              </div>
            </div>
            <div className="stake-panel-footer nomargin noshadow">
              <div className="farm-btn cancel" onClick={this.onClose}>
                {toLocale('cancel')}
              </div>
              <div className="farm-btn" onClick={this.onSuccess}>
                {toLocale('Check')}
              </div>
            </div>
          </div>
        </Dialog>
      );
    return null;
  };

  render() {
    return (
      <>
        {this.getRender()}
        {this.createBtn()}
        <Confirm
          onClick={this.confirm}
          loadingTxt={toLocale('pending transactions')}
          successTxt={toLocale('transaction confirmed')}
          getRef={(instance) => (this.confirmInstance = instance)}
        ></Confirm>
      </>
    );
  }
}
