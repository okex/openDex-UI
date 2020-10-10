import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import coinDefault from '_src/assets/images/icon_f2pool@2x.png';
import coinOkt from '_src/assets/images/icon_usdt@2x.png';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WatchlistPanel extends React.Component {

  render() {
    const data = [1,2,3,4,1,2,3,4,1,2,3,4,1,2];
    return (
      <div className="panel-watchlist">
        <table>
          <tbody>
            <tr className="table-head">
              <td width="269">{toLocale('Swap Pair')}</td>
              <td width="164"><div className="head-sort">{toLocale('Liquidity')}<div><i className="up"/><i className="down"/></div></div></td>
              <td width="164"><div className="head-sort">{toLocale('24H Volume')}<div><i className="up"/><i className="down"/></div></div></td>
              <td width="102"><div className="head-sort">{toLocale('Fee APY')}<div><i className="up"/><i className="down active"/></div></div></td>
              <td width="194"><div className="head-sort">{toLocale('Last Price')}<div><i className="up"/><i className="down"/></div></div></td>
              <td width="128"><div className="head-sort">{toLocale('24H Change')}<div><i className="up"/><i className="down"/></div></div></td>
              <td>{toLocale('Action')}</td>
            </tr>
            {data.map((d,index) =>
              <tr key={index}>
                <td>
                  <div className="coin2coin">
                    <img src={coinOkt} />
                    <img src={coinDefault} />
                    <span>OKT/USDK</span>
                  </div>
                </td>
                <td>$24,163,003.20</td>
                <td>$24,163,003.20</td>
                <td>102.12%</td>
                <td className="green">1 OKT≈10.1234 USDK</td>
                <td className="red">-12.12%</td>
                <td>
                  <div className="action-opt-wrap">
            <div className="action-opt">+ {toLocale('Add Liquidity')}</div>
                    <div className="action-sep"></div>
                    <div className="action-opt">{toLocale('Trade')}</div>
                  </div>
                </td>
              </tr>
            )}</tbody>
        </table>
        <div className="pagination-wrap">
          <div className="pagination">
            <div className="pagination-prev disabled"><i className="iconfont before" /></div>
            <div className="pagination-page">1</div>
            <div className="pagination-more"><i className="iconfont more" /></div>
            <div className="pagination-page active">6</div>
            <div className="pagination-page">7</div>
            <div className="pagination-page">8</div>
            <div className="pagination-page">9</div>
            <div className="pagination-page">10</div>
            <div className="pagination-next"><i className="iconfont after" /></div>
          </div>
        </div>
      </div>
    );
  }
}
