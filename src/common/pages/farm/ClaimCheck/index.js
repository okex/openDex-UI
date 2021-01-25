import React from 'react';
import { toLocale } from '_src/locale/react-locale';
export default class ClaimCheck extends React.Component {

  onSuccess = () => {
    const { onClose, onSuccess } = this.props;
    onClose && onClose();
    onSuccess && onSuccess();
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className="stake-panel" style={{ width: '496px' }}>
        <div className="stake-panel-title no-title">
          <span className="close" onClick={onClose}>
            ×
          </span>
        </div>
        <div className="stake-panel-content">
          <div className="infotip unstake">
            {toLocale('unstake confirm info')}
          </div>
        </div>
        <div className="stake-panel-footer nomargin noshadow">
          <div className="farm-btn cancel" onClick={onClose}>
            {toLocale('cancel')}
          </div>
          <div className="farm-btn" onClick={this.onSuccess}>{toLocale('Unstake')}</div>
        </div>
      </div>
    );
  }
}
