
import React from 'react';
import { toLocale } from '_src/locale/react-locale'
export default class Stake extends React.Component {

  confirm = () => {

  }

  render() {
    const {data,onClose} = this.props;
    return (
      <div className="stake-panel">
        <div className="stake-panel-title">{toLocale('Claim details')}<span className="close" onClick={onClose}>×</span></div>
        <div className="stake-panel-content">
          <div className="stake-panel-table">
            <table>
              <tbody>
                <tr className="thead">
                  <td width="153">{toLocale('Token')}</td>
                  <td>{toLocale('Claimed')}</td>
                  <td width="150">{toLocale('Unclaimed')}</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="stake-panel-footer nomargin">
          <div className="btn" onClick={this.confirm}>{toLocale('OK')}</div>
        </div>
      </div>
      );
  }
}