import React, { Component } from 'react';
import { toLocale } from '_src/locale/react-locale';
import QRCode from 'qrcode.react';
import Icon from '_src/component/IconLite';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './index.less';

class WalletAddress extends Component {
  constructor() {
    super();
    this.state = {
      copySuccess: false,
    };
  }

  onCopy = () => {
    if (this.state.copySuccess) return;
    this.setState({ copySuccess: true });
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => {
      this.setState({ copySuccess: false });
    }, 1000);
  };

  render() {
    const { senderAddr } = window.OK_GLOBAL || {};
    const { copySuccess } = this.state;
    return (
      <div className="my-address">
        <span>{toLocale('assets_address')}{senderAddr}</span>
        <div className="qr-container">
          <Icon className="icon-icon_erweima" />
          <div className="qr-pic">
            <QRCode value={senderAddr || ''} size={75} />
          </div>
        </div>
        <CopyToClipboard text={senderAddr} onCopy={this.onCopy}>
          <Icon className={copySuccess ? 'icon-icon_success' : 'icon-icon_copy'} isColor />
        </CopyToClipboard>
      </div>
    );
  }
}

export default WalletAddress;
