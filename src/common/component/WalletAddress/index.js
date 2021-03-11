import React, { Component } from 'react';
import { toLocale } from '_src/locale/react-locale';
import QRCode from 'qrcode.react';
import Icon from '_src/component/IconLite';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import WalletAddressTooltip from './WalletAddressTooltip';
import introduce from '_src/assets/images/introduce.svg'
import qrcode from '_src/assets/images/qrcode.svg'
import copy from '_src/assets/images/copy.svg'
import addressConversion from '_src/utils/conversionAddress';

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
  get senderAddr () {
    const { senderAddr } = window.OK_GLOBAL || {};
    const { addressType } = this.props
    return addressType === 'OKExChain' ? senderAddr : addressConversion(senderAddr)
  }
  render() {
    const senderAddr = this.senderAddr
    const { copySuccess } = this.state;
    const { addressType } = this.props
    console.log(addressType, 'addressType=====')
    return (
      <div className="my-address">
        <div className="address-content">
          {addressType === 'OKExChain' ? toLocale('assets_address_OKExChain') : toLocale('assets_address')}
          {addressType === 'OKExChain' && (<WalletAddressTooltip
              placement="bottomLeft"
              trigger="click"
              align={{
                offset: [-34, 14],
              }}
            >
              <img className="icon-introduce" src={introduce} alt=""/>
            </WalletAddressTooltip>)
          }
          <span className="address-text">{ senderAddr }</span>
        </div>
        <div className="qr-container">
          <img src={qrcode} alt=""/>
          <div className="qr-pic">
            <QRCode value={senderAddr || ''} size={75} />
          </div>
        </div>
        <CopyToClipboard text={senderAddr} onCopy={this.onCopy}>
          <div>
            <Icon style={{display: copySuccess ? 'inline' : 'none' }} className="icon-icon_success" isColor />
            <img className={copySuccess ? 'hidden' : ''} src={copy} alt=""/>
          </div>
        </CopyToClipboard>
      </div>
    );
  }
}

export default WalletAddress;
