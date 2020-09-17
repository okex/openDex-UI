import React from 'react';
import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Config from '_constants/Config';

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
  render() {
    const { address } = this.props;
    const { copySuccess } = this.state;
    return (
      <ul className="wallet-menu-address">
        <li className="wallet-menu-address-tool">
          {toLocale('header_menu_item_address')}
          <CopyToClipboard text={address} onCopy={this.handleCopy}>
            <Icon
              className={copySuccess ? 'icon-icon_success' : 'icon-icon_copy'}
              isColor
              style={{
                width: 14,
                height: 14,
                cursor: 'pointer',
              }}
            />
          </CopyToClipboard>
        </li>
        <li className="wallet-menu-address-text">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${Config.okchain.browserAddressUrl}/${address}`}
          >
            {`${address.substr(0, 20)}…`}
          </a>
        </li>
      </ul>
    );
  }
}

export default WalletMenuTool;
