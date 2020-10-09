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
export default class SwapPanel extends React.Component {

  render() {
    return (
      <>
        <div className="panel panel-swap">
          <div className="coin-item">
            <div className="coin-item-title">
              <div>{toLocale('From')}</div>
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
          <div className="sep transformation-sep"></div>
          <div className="coin-item">
            <div className="coin-item-title">
              <div>{toLocale('To(estimated)')}</div>
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
              <div className="info-name">{toLocale('Minimum received')}<i className="help" /></div>
              <div className="info-value">12.35 USDK</div>
            </div>
            <div className="info">
              <div className="info-name">{toLocale('Price Impact')}<i className="help" /></div>
              <div className="info-value">0.72%</div>
            </div>
            <div className="info">
              <div className="info-name">{toLocale('Liquidity Provider Fee')}<i className="help" /></div>
              <div className="info-value">0.003 OKT</div>
            </div>
            <div className="info">
              <div className="info-name">{toLocale('Route')}<i className="help" /></div>
              <div className="info-value"><img className="coin" src={coinOkt} />OKT &gt; <img className="coin" src={coinOkt} />USDK &gt;<img className="coin" src={coinOkt} />DAI</div>
            </div>
          </div>
          <div className="btn-wrap">
            {/* <div className="btn">{toLocale('Connect Wallet')}</div> */}
            <div className="btn disabled">{toLocale('Invalid Pair')}</div>
          </div>
        </div>
        <div className="panel-coin-search">
          <div className="search-wrap iconfont"><input placeholder={toLocale('Search name')}/></div>
          <div className="search-content-wrap">
            <div className="search-content-items">
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="search-content-item">
                <div className="name">
                  <img src={coinOkt}/>
                  OKT
                </div>
                <div className="value">70.123456</div>
              </div>
              <div className="nodata">
                {toLocale('No Records')}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
