import React from 'react';
import { Link } from 'react-router-dom';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
export default class ConnectInfoTip extends React.Component {
  render() {
    const { onClose } = this.props;
    return (
      <div className="stake-panel" style={{ width: '392px' }}>
        <div className="stake-panel-title no-title">
          <span className="close" onClick={onClose}>
            ×
          </span>
        </div>
        <div className="stake-panel-content">
          <div className="infotip">
            {toLocale('You haven’t connected a wallet.')}
          </div>
        </div>
        <div className="stake-panel-footer nomargin noshadow">
          <Link to={getLangURL(PageURL.walletCreate)}>
            <div className="farm-btn">{toLocale('Connect Wallet')}</div>
          </Link>
        </div>
      </div>
    );
  }
}
