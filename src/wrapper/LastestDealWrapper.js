import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calc } from '_component/okit';
import { toLocale } from '_src/locale/react-locale';
import moment from 'moment';
import { wsV3, channelsV3 } from '../utils/websocket';
import Config from '../constants/Config';
import * as SpotTradeActions from '../redux/actions/SpotTradeAction';
import util from '../utils/util';


function mapStateToProps(state) {
  const { product, deals } = state.SpotTrade;
  const { wsIsOnlineV3, wsErrCounterV3 } = state.Spot;
  return {
    product,
    deals,
    wsIsOnlineV3,
    wsErrCounterV3
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotTradeActions: bindActionCreators(SpotTradeActions, dispatch)
  };
}
const LastestDealWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class LastestDeals extends React.Component {
    // constructor(props) {
    //   super(props);
    // }

    componentDidMount() {
      const { product, wsIsOnlineV3, spotTradeActions } = this.props;
      // 有币对且推送不在线
      if (product.length) {
        if (wsIsOnlineV3) {
          this.startWs(product);
        } else {
          spotTradeActions.getDeals(product);
        }
      }
    }
    componentWillReceiveProps(nextProps) {
      /* product变化相关 */
      const oldproduct = this.props.product;
      const newproduct = nextProps.product;
      const { spotTradeActions } = nextProps;
      /* ws状态变化相关 */
      const newWsIsOnline = nextProps.wsIsOnlineV3;
      const oldWsIsOnline = this.props.wsIsOnlineV3;

      if (newproduct !== oldproduct) {
        if (oldproduct === '') { // 首次获取product
          if (newWsIsOnline) {
            this.startWs(newproduct);
          } else {
            spotTradeActions.getDeals(newproduct);
          }
        } else if (newproduct !== '') { // product发生改变，比如左侧菜单切换
          this.changeProduct(oldproduct, newproduct);
        }
      }

      // ws首次连接或者重连成功
      if (!oldWsIsOnline && newWsIsOnline && newproduct !== '') {
        spotTradeActions.getDeals(newproduct); // 【断网补偿】获取最新成交
        this.startWs(newproduct);
      }
      const oldWsErrCounter = this.props.wsErrCounterV3;
      const newWsErrCounter = nextProps.wsErrCounterV3;
      // ws断线
      if (newWsErrCounter > oldWsErrCounter) {
        // 获取K线数据
        spotTradeActions.getDeals(newproduct);
      }
    }
    componentWillUnmount() {
      clearInterval(window.dealsHandler);
    }

    getDealsColumn = () => {
      const { product } = this.props;
      let baseCurr = '';
      let tradeCurr = '';
      if (product.indexOf('_') > -1) {
        tradeCurr = product.split('_')[0].toUpperCase();
        baseCurr = product.split('_')[1].toUpperCase();
        tradeCurr = tradeCurr.split('-').length > 0 ? tradeCurr.split('-')[0] : tradeCurr;
      }
      // const enumColor = { 1: 'deals-green', 2: 'deals-red' };
      const config = window.OK_GLOBAL.productConfig;
      return [{
        title: toLocale('spot.deals.price').replace('-', baseCurr),
        key: 'price',
        render: (text, data) => {
          // const color = enumColor[data.side];
          const price = calc.showFloorTruncation(text, config.max_price_digit);
          return (<label className={data.color}>{price}</label>);
        }
      }, {
        title: toLocale('spot.deals.amount').replace('-', tradeCurr),
        key: 'volume',
        render: (text) => {
          const amount = calc.showFloorTruncation(text, config.max_size_digit);
          return (<label>{amount}</label>);
        }
      }, {
        title: toLocale('spot.deals.time'),
        key: 'timestamp',
        render: (text) => {
          const dateTime = util.timeStampToTime(parseInt(text, 10), 'yyyy-MM-dd hh:mm:ss');
          // const date = dateTime.split(' ')[0];
          const time = dateTime.split(' ')[1];
          return time;
        }
      }];
    };

    getDealsEmpty = () => {
      return toLocale('spot.deals.no');
    };

    startWs = (product) => {
      const { spotTradeActions } = this.props;
      wsV3.stop(channelsV3.getMatches(product));
      spotTradeActions.getDeals(product, () => {
        wsV3.send(channelsV3.getMatches(product));
      });
    };
    // 停止ws订阅
    // stopWs = (product) => {
    //   // 停止订阅所有币行情，即ticker
    //   wsV3.stop(channelsV3.getMatches(product));
    // };


    // 切币对
    changeProduct = (oldproduct, newproduct) => {
      const { wsIsOnlineV3, spotTradeActions } = this.props;
      if (window.OK_GLOBAL.ws_v3 && wsIsOnlineV3) {
        // 停掉旧币种的最新成交记录
        wsV3.stop(channelsV3.getMatches(oldproduct));
        // 方案有2， 1是清空，可以应对99.9%的概览 ，2是ws推送的时候把deal返回的数据整体放开，可以拿返回的product与当前product比对，100%概率
        spotTradeActions.clearDeals();
        // 订阅新币种的最新成交记录
        spotTradeActions.getDeals(newproduct, () => {
          wsV3.send(channelsV3.getMatches(newproduct));
        });
      } else {
        spotTradeActions.getDeals(newproduct);
      }
    };

    render() {
      const { deals } = this.props;
      return (
        <Component
          dataSource={deals}
          empty={this.getDealsEmpty()}
          columns={this.getDealsColumn()}
        />
      );
    }
  }
  return LastestDeals;
};
export default LastestDealWrapper;

