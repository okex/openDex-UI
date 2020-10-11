import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import coinOkt from '_src/assets/images/icon_usdt@2x.png';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SelectCoin extends React.Component {

  render() {
    return (
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
    );
  }
}