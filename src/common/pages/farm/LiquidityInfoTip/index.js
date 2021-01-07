
import React from 'react';
import { Link } from 'react-router-dom';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale'
export default class LiquidityInfoTip extends React.Component {

  render() {
    const {onClose} = this.props;
    return (
      <div className="stake-panel">
        <div className="stake-panel-title">&nbsp;<span className="close" onClick={onClose}>×</span></div>
        <div className="stake-panel-content">
          <div className="infotip">
            {toLocale('You didn’t have any LP tokens')}
          </div>
        </div>
        <div className="stake-panel-footer nomargin">
          <div className="btn cancel" onClick={onClose}>{toLocale('cancel')}</div>
          <Link to={getLangURL(PageURL.swapPage)}>
            <div className="btn">{toLocale('Add Liquidity')}</div>
          </Link>
        </div>
      </div>
      );
  }
}