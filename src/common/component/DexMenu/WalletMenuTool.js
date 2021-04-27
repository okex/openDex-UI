import React from 'react';
import Icon from '_src/component/IconLite';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Config from '_constants/Config';
import copyBlue from '_src/assets/images/copyBlue.svg';
import introduce from '_src/assets/images/introduce.svg';

class WalletMenuTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copySuccess: false,
    };
  }

  handleCopy = () => {
    this.setState({ copySuccess: true });
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => {
      this.setState({ copySuccess: false });
    }, 1000);
  };

  openInstructions = () => {
    window.open(Config.okexchain.doubleAddress);
  };

  render() {
    const { addressLabel, address, addressType } = this.props;
    const { copySuccess } = this.state;
    return (
      <ul className="wallet-menu-address">
        <li className="wallet-menu-address-tool">
          <div>
            {addressLabel}
            {addressType === 'okexchain' && (
              <img
                className="icon-introduce"
                onClick={this.openInstructions}
                src={introduce}
                alt=""
              />
            )}
          </div>
          <CopyToClipboard text={address} onCopy={this.handleCopy}>
            <div>
              <Icon
                className="icon-icon_success"
                isColor
                style={{
                  width: 14,
                  height: 14,
                  cursor: 'pointer',
                  display: copySuccess ? 'inline' : 'none',
                }}
              />
              <img
                className={copySuccess ? 'hidden' : ''}
                src={copyBlue}
                alt=""
              />
            </div>
          </CopyToClipboard>
        </li>
        <li className="wallet-menu-address-text">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${Config.okexchain.browserAddressUrl}/${address}`}
          >
            {address}
          </a>
        </li>
      </ul>
    );
  }
}

export default WalletMenuTool;
