import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import util from '../../utils/util';
import Enum from '../../utils/Enum';

import './Introduce.less';

function mapStateToProps(state) {
  return {
    product: state.SpotTrade.product,
    currencyObjByName: state.SpotTrade.currencyObjByName
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class Introduce extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      introduceObj: {} // 不用null，是防止后端正确返回的就是空对象
    };
  }

  componentDidMount() {
    if (this.props.product) {
      this.getIntroduceBySymbol(this.props.product.split('_')[0]);
    }
  }

  componentWillReceiveProps(nextProps) {
    const product = nextProps.product;
    if (product) {
      this.getIntroduceBySymbol(product.split('_')[0]);
    }
  }

  getIntroduceBySymbol = (currency) => {
    if (window.OK_GLOBAL.tradeType === Enum.tradeType.fullTrade) {
      // document.body.classList.add('full-body');
    }
    const currencyObj = this.props.currencyObjByName;
    // const name = currencyObj[currency] ? currencyObj[currency].description : '';
    const o = currencyObj[currency];
    if (o) {
      this.setState({
        introduceObj: {
          name: o.description ? o.description : '',
          whole_name: o.whole_name ? o.whole_name : '',
          original_symbol: o.original_symbol ? o.original_symbol : '',
          total_supply: o.total_supply ? o.total_supply : '',
        }
      });
    }
    // ont.get(URL.GET_INTRODUCE, {
    //   params: {
    //     currency
    //   }
    // }).then((res) => {
    //   const introduceObj = res.data;
    //   this.setState({
    //     introduceObj
    //   });
    // }).catch(() => {
    //   this.setState({
    //     introduceObj: {}
    //   });
    // });
    /* this.setState({
          introduceObj: {
              "blockUrl": "www.bit.com",
              "circulationAmount": "2000",
              "connect": "www.bit.com",
              "crowdfunding": "100",
              "currencyId": 0,
              "distributionAmount": "10000",
              "exchangeRate": "200",
              "icoBasecoinPrice": "100",
              "introduction": "它诞生于2009年1月3日，它诞生于2009年1月3日，它诞生于2009年1月3日",
              "name": "比特币",
              "releaseTime": "2015-01-01",
              "website": "https://bitcoin.org/en/",
              "whitePaper": "www.bit.com"
          }
      }); */
  };

  render() {
    const { product } = this.props;
    const currency = product.split('_')[0].toUpperCase();
    const { introduceObj } = this.state;

    if (util.isEmpty(introduceObj)) {
      return <div>{toLocale('spot.kline.noInfo')}</div>;
    }
    const moreLink = introduceObj.connect ? (
      <a
        href={introduceObj.connect}
        style={{ marginLeft: '10px' }}
        rel="noopener noreferrer"
        target="_blank"
      >
        {toLocale('spot.place.kline.more')}
      </a>
    ) : null;

    return (
      <div className="introduce-container">
        <div className="introduce-pairTitle">
          {toLocale('symbolWholeName')} {`${introduceObj.whole_name}`} <br /><br />
          {toLocale('symbolId')} {`${currency}`} <br /><br />
          {toLocale('symbolDesc')} {`${introduceObj.name}`}
        </div>
        {/*
        <a
          href={`/project/${projectId || ''}`}
          className="project-detail-link"
          rel="noopener noreferrer"
          target="_blank"
        >
          {toLocale('spot.project.info')}
        </a> */}
        {/*
        <div className="introduce-layer">
          <div>
            <span className="introduce-label">
              {toLocale('spot.ticker.introduce.releaseTime')}
            </span>
            <span className="introduce-label-connent">{introduceObj.releaseTime || '--'}</span>
          </div>
          <div>
            <span
              className="introduce-label"
            >{toLocale('spot.ticker.introduce.distributionAmount')}
            </span>
            <span className="introduce-label-connent">{introduceObj.distributionAmount || '--'}</span>
          </div>
          <div>
            <span
              className="introduce-label"
            >{toLocale('spot.ticker.introduce.circulationAmount')}
            </span>
            <span className="introduce-label-connent">{introduceObj.circulationAmount || '--'}</span>
          </div>
          <div>
            <span className="introduce-label">
              {toLocale('spot.ticker.introduce.crowdfunding')}
            </span>
            <span className="introduce-label-connent">{introduceObj.crowdfunding || '--'}</span>
          </div>
        </div>
        <div className="flex-row">
          <span className="introduce-label">
            {toLocale('spot.ticker.introduce.website')}
          </span>
          {
            introduceObj.website ? (
              <a
                href={introduceObj.website}
                rel="noopener noreferrer"
                target="_blank"
              >
                {introduceObj.website}
              </a>
            ) : <span className="introduce-label-connent">--</span>
          }
        </div>
        <div className="flex-row">
          <span className="introduce-label">
            {toLocale('spot.ticker.introduce.whitePaper')}
          </span>
          {
            introduceObj.whitePaper ? (
              <a
                href={introduceObj.whitePaper}
                rel="noopener noreferrer"
                target="_blank"
              >
                {introduceObj.whitePaper}
              </a>
            ) : <span className="introduce-label-connent">--</span>
          }
        </div>
        <div>
          <span className="introduce-label">
            {toLocale('spot.ticker.introduce.introduction')}
            {moreLink}
          </span>
          <p className="introduce-label-connent">
            {introduceObj.introduction || '--'}
          </p>
        </div>
        */}
      </div>
    );
  }
}
export default Introduce;
