import React from 'react';
import { Link } from 'react-router-dom';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
export default class LiquidityInfoTip extends React.Component {
  render() {
    const { onClose, data } = this.props;
    return (
      <div className="stake-panel" style={{ width: '496px' }}>
        <div className="stake-panel-title no-title">
          <span className="close" onClick={onClose}>
            ×
          </span>
        </div>
        <div className="stake-panel-content">
          <div className="infotip">
            {toLocale('You didn’t have any LP tokens', {
              pool_name: data.pool_name_dis,
            })}
          </div>
        </div>
        <div className="stake-panel-footer nomargin noshadow">
          <div className="farm-btn cancel" onClick={onClose}>
            {toLocale('cancel')}
          </div>
          {/* 暂未考虑桌面端 */}
          <a href={getLangURL(PageURL.swapPage)} target="_blank" rel="noopener noreferrer">
            <div className="farm-btn">{toLocale('Add Liquidity')}</div>
          </a>
        </div>
      </div>
    );
  }
}
