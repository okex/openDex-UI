import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commonActions from '_src/redux/actions/CommonAction';
import QRCodeReact from 'qrcode.react';

function mapStateToProps(state) {
  const { qrcodeUri } = state.Common;
  return { qrcodeUri };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(commonActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class ImportByWalletConnectQrcode extends Component {
  hide = () => {
    this.props.commonAction.clearWalletConnectQrcode();
  };

  render() {
    const qrcodeUri = this.props.qrcodeUri;
    if (!qrcodeUri) return null;
    return (
      <div className="wallet-connect-qrcode-wrap">
        <div className="wallet-connect-qrcode" onClick={this.hide}>
          <div className="qrcode-title">
            {toLocale('wallet_connect_qrcode')}
          </div>
          <div className="qrcode-contain">
            <div className="qrcode-title-desc">
              {toLocale('wallet_connect_qrcodedesc')}
            </div>
            <div className="qrcode-img">
              <QRCodeReact size={240} value={qrcodeUri} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ImportByWalletConnectQrcode;
