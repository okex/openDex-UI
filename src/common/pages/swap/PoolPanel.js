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
export default class PoolPanel extends React.Component {

  render() {
    return (
      <>
        <div className="panel panel-pool">
          <div className="btn add-icon">{toLocale('Add Liquidity')}</div>
          <div className="liquidity">
            <div className="left">{toLocale('Your Liquidity')}</div>
            <div className="right">{toLocale('Create Liquidity')}</div>
          </div>
          <div className="poll-items-wrap">
            <div className="poll-items">
              <div className="poll-item">
                <div className="space-between poll-item-title">
                  <div className="left title-img">
                    <img src={coinOkt} />
                    <img src={coinDefault} />
                    <span className="title-name">OKT/USDK</span>
                  </div>
                  <div className="right title-opt">
                    <div className="opt">+ {toLocale('Add')}</div>
                    <div className="opt">- {toLocale('Reduce')}</div>
                  </div>
                </div>
                <div className="space-between poll-item-txt">
                  <div className="left">{toLocale('Amount')} OKT/USDK</div>
                  <div className="right">{toLocale('LP token/ratio')}</div>
                </div>
                <div className="space-between poll-item-info">
                  <div className="left">232,124.12/1,231,415.06</div>
                  <div className="right">1,241,245/0.42%</div>
                </div>
              </div>
              <div className="poll-item">
                <div className="space-between poll-item-title">
                  <div className="left title-img">
                    <img src={coinOkt} />
                    <img src={coinDefault} />
                    <span className="title-name">OKT/USDK</span>
                  </div>
                  <div className="right title-opt">
                    <div className="opt">+ {toLocale('Add')}</div>
                    <div className="opt">- {toLocale('Reduce')}</div>
                  </div>
                </div>
                <div className="space-between poll-item-txt">
                  <div className="left">{toLocale('Amount')} OKT/USDK</div>
                  <div className="right">{toLocale('LP token/ratio')}</div>
                </div>
                <div className="space-between poll-item-info">
                  <div className="left">232,124.12/1,231,415.06</div>
                  <div className="right">1,241,245/0.42%</div>
                </div>
              </div>
              <div className="poll-item">
                <div className="space-between poll-item-title">
                  <div className="left title-img">
                    <img src={coinOkt} />
                    <img src={coinDefault} />
                    <span className="title-name">OKT/USDK</span>
                  </div>
                  <div className="right title-opt">
                    <div className="opt">+ {toLocale('Add')}</div>
                    <div className="opt">- {toLocale('Reduce')}</div>
                  </div>
                </div>
                <div className="space-between poll-item-txt">
                  <div className="left">{toLocale('Amount')} OKT/USDK</div>
                  <div className="right">{toLocale('LP token/ratio')}</div>
                </div>
                <div className="space-between poll-item-info">
                  <div className="left">232,124.12/1,231,415.06</div>
                  <div className="right">1,241,245/0.42%</div>
                </div>
              </div>
              <div className="poll-item">
                <div className="space-between poll-item-title">
                  <div className="left title-img">
                    <img src={coinOkt} />
                    <img src={coinDefault} />
                    <span className="title-name">OKT/USDK</span>
                  </div>
                  <div className="right title-opt">
                    <div className="opt">+ {toLocale('Add')}</div>
                    <div className="opt">- {toLocale('Reduce')}</div>
                  </div>
                </div>
                <div className="space-between poll-item-txt">
                  <div className="left">{toLocale('Amount')} OKT/USDK</div>
                  <div className="right">{toLocale('LP token/ratio')}</div>
                </div>
                <div className="space-between poll-item-info">
                  <div className="left">232,124.12/1,231,415.06</div>
                  <div className="right">1,241,245/0.42%</div>
                </div>
              </div>
              <div className="poll-item">
                <div className="space-between poll-item-title">
                  <div className="left title-img">
                    <img src={coinOkt} />
                    <img src={coinDefault} />
                    <span className="title-name">OKT/USDK</span>
                  </div>
                  <div className="right title-opt">
                    <div className="opt">+ {toLocale('Add')}</div>
                    <div className="opt">- {toLocale('Reduce')}</div>
                  </div>
                </div>
                <div className="space-between poll-item-txt">
                  <div className="left">{toLocale('Amount')} OKT/USDK</div>
                  <div className="right">{toLocale('LP token/ratio')}</div>
                </div>
                <div className="space-between poll-item-info">
                  <div className="left">232,124.12/1,231,415.06</div>
                  <div className="right">1,241,245/0.42%</div>
                </div>
              </div>
              <div className="poll-item">
                <div className="space-between poll-item-title">
                  <div className="left title-img">
                    <img src={coinOkt} />
                    <img src={coinDefault} />
                    <span className="title-name">OKT/USDK</span>
                  </div>
                  <div className="right title-opt">
                    <div className="opt">+ {toLocale('Add')}</div>
                    <div className="opt">- {toLocale('Reduce')}</div>
                  </div>
                </div>
                <div className="space-between poll-item-txt">
                  <div className="left">{toLocale('Amount')} OKT/USDK</div>
                  <div className="right">{toLocale('LP token/ratio')}</div>
                </div>
                <div className="space-between poll-item-info">
                  <div className="left">232,124.12/1,231,415.06</div>
                  <div className="right">1,241,245/0.42%</div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="nodata">
            {toLocale('No Liquidity Found')}
          </div> */}
        </div>

        <div className="panel">
          <div className="panel-header">
            <i className="iconfont before"></i>
            {toLocale('Add Liquidity')}
          </div>
          <div className="add-liquidity-content">
            <div className="coin-item">
              <div className="coin-item-title">
                <div>{toLocale('Input')}</div>
                <div className="txt">{toLocale('Balance')}: 70.123456<span className='max'>MAX</span></div>
              </div>
              <div className="coin-item-content">
                <div className="input"><input type="text" placeholder="0.000000" /></div>
                <div className="coin-select">
                  <img className="coin-icon" src={coinOkt} />
                  <span className="text active">OKT</span>
                  <i className="iconfont" />
                </div>
              </div>
            </div>
            <div className="sep add-sep"></div>
            <div className="coin-item">
              <div className="coin-item-title">
                <div>{toLocale('Input')}</div>
                <div className="txt">{toLocale('Balance')}: 70.123456</div>
              </div>
              <div className="coin-item-content">
                <div className="input"><input type="text" placeholder="0.000000" /></div>
                <div className="coin-select">
                  <img className="coin-icon" src={coinDefault} />
                  <span className="text">{toLocale('Select a token')}</span>
                  <i className="iconfont" />
                </div>
              </div>
            </div>
            <div className="coin-exchange-detail">
              <div className="info">
                <div className="info-name">{toLocale('Price')}</div>
                <div className="info-value"><i className="exchange" />1DAI ≈ 1,000OKT</div>
              </div>
              <div className="info">
                <div className="info-name">{toLocale('Pool share')}<i className="help" /></div>
                <div className="info-value">12.35 USDK</div>
              </div>
            </div>
            <div className="btn-wrap">
              {/* <div className="btn">{toLocale('Connect Wallet')}</div> */}
              <div className="btn disabled">{toLocale('Invalid Pair')}</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="poll-item">
            <div className="space-between poll-item-title">
              <div className="left title-img">
                <img src={coinOkt} />
                <img src={coinDefault} />
                <span className="title-name">OKT/USDK</span>
              </div>
              <div className="right title-opt">
                <div className="opt">- {toLocale('Reduce')}</div>
              </div>
            </div>
            <div className="space-between poll-item-txt">
              <div className="left">{toLocale('Amount')} OKT/USDK</div>
              <div className="right">{toLocale('LP token/ratio')}</div>
            </div>
            <div className="space-between poll-item-info">
              <div className="left">232,124.12/1,231,415.06</div>
              <div className="right">1,241,245/0.42%</div>
            </div>
          </div>
        </div>
        
        <div className="panel">
          <div className="panel-header">
            <i className="iconfont before"></i>
            {toLocale('Input Pool')}
          </div>
          <div className="add-liquidity-content">
            <div className="coin-dropdown">
              <div className="coin-select">
                <img className="coin-icon" src={coinOkt} />
                <span className="text active">OKT</span>
                <i className="iconfont" />
              </div>
            </div>
            <div className="sep add-sep"></div>
            <div className="coin-dropdown">
                <div className="coin-select">
                  <img className="coin-icon" src={coinDefault} />
                  <span className="text">{toLocale('Select a token')}</span>
                  <i className="iconfont" />
                </div>
            </div>
        <div className="error-tip">{toLocale('Error')}：{toLocale('Existed Pool')}</div>
        {/* <div className="error-tip">{toLocale('Error')}：{toLocale('Invalid Pair')}</div> */}
            <div className="btn-wrap">
              <div className="btn">{toLocale('Create Liquidity')}</div>
              {/* <div className="btn disabled">{toLocale('Create Liquidity')}</div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}
