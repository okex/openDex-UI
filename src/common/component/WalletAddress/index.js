import React, { Component } from 'react';
import { toLocale } from '_src/locale/react-locale';
import QRCode from 'qrcode.react';
import Icon from '_src/component/IconLite';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import WalletAddressTooltip from './WalletAddressTooltip';
import { getCoinIcon, getDisplaySymbol } from '_src/utils/coinIcon';
import './index.less';
function addressConversion (addr) {
  return '0x' + addr
}
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
    const { addressType } = this.props
    console.log(addressType, 'addressType=====')
    return (
      <div className="my-address">
        <span>
          {toLocale('assets_address')}
          {addressType === 'OKExChain' && (<WalletAddressTooltip
              // tooltipAvg={tooltipAvg}
              // tooltipTotal={tooltipTotal}
              // tooltipSum={tooltipSum}
              placement="bottomRight"// {isDark ? 'right' : 'left'}
              trigger="click"
              // symbol={product}
              align={{
                offset: [30, 10],
              }}
            >
              <img className="icon-introduce" src={getCoinIcon('DEX')} alt=""/>
              {/* <div>this is children</div> */}
              {/* <li
                key={`ok-depth-sell-${index}`}
                className={`sell-item ${
                  sellIndex > -1 && index >= sellIndex ? 'has-bg' : ''
                }`}
                onClick={this.handleClickItem(index, Enum.sell)}
                onMouseEnter={() => {
                  this.setState({ sellIndex: index });
                }}
                onMouseLeave={() => {
                  this.setState({ sellIndex: -1 });
                }}
              >
                <span>{price}</span>
                <span>{amountValue < 0.001 ? '0.001' : amount}</span>
                {needSum && <span>{sum}</span>}
                {needBgColor && (
                  <div
                    className="process-bar"
                    style={{ width: barWidth }}
                  />
                )}
              </li> */}
            </WalletAddressTooltip>)
          }
          { addressType === 'OKExChain' ? senderAddr : addressConversion(senderAddr) }
        </span>
        <div className="qr-container">
          <Icon className="icon-icon_erweima" />
          <div className="qr-pic">
            <QRCode value={senderAddr || ''} size={75} />
          </div>
        </div>
        <CopyToClipboard text={senderAddr} onCopy={this.onCopy}>
          <Icon
            className={copySuccess ? 'icon-icon_success' : 'icon-icon_copy'}
            isColor
          />
        </CopyToClipboard>
      </div>
    );
  }
}

export default WalletAddress;
