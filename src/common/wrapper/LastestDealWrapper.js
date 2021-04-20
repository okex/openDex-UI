import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calc } from '_component/okit';
import { toLocale } from '_src/locale/react-locale';
import { getDisplaySymbol } from '_src/utils/coinIcon';
import { wsV3, channelsV3 } from '../utils/websocket';
import * as SpotTradeActions from '../redux/actions/SpotTradeAction';
import util from '../utils/util';

function mapStateToProps(state) {
  const { product, deals } = state.SpotTrade;
  const { wsIsOnlineV3, wsErrCounterV3 } = state.Spot;
  return {
    product,
    deals,
    wsIsOnlineV3,
    wsErrCounterV3,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotTradeActions: bindActionCreators(SpotTradeActions, dispatch),
  };
}
const LastestDealWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class LastestDeals extends React.Component {
    componentDidMount() {
      const { product, wsIsOnlineV3, spotTradeActions } = this.props;
      if (product.length) {
        if (wsIsOnlineV3) {
          this.startWs(product);
        } else {
          spotTradeActions.getDeals(product);
        }
      }
    }

    componentWillReceiveProps(nextProps) {
      const oldproduct = this.props.product;
      const newproduct = nextProps.product;
      const { spotTradeActions } = nextProps;
      const newWsIsOnline = nextProps.wsIsOnlineV3;
      const oldWsIsOnline = this.props.wsIsOnlineV3;

      if (newproduct !== oldproduct) {
        if (oldproduct === '') {
          if (newWsIsOnline) {
            this.startWs(newproduct);
          } else {
            spotTradeActions.getDeals(newproduct);
          }
        } else if (newproduct !== '') {
          this.changeProduct(oldproduct, newproduct);
        }
      }

      if (!oldWsIsOnline && newWsIsOnline && newproduct !== '') {
        spotTradeActions.getDeals(newproduct);
        this.startWs(newproduct);
      }
      const oldWsErrCounter = this.props.wsErrCounterV3;
      const newWsErrCounter = nextProps.wsErrCounterV3;
      if (newWsErrCounter > oldWsErrCounter) {
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
        tradeCurr =
          tradeCurr.split('-').length > 0 ? tradeCurr.split('-')[0] : tradeCurr;
      }
      const config = window.OK_GLOBAL.productConfig;
      return [
        {
          title: toLocale('spot.deals.price').replace(
            '-',
            getDisplaySymbol(baseCurr)
          ),
          key: 'price',
          render: (text, data) => {
            const price = calc.showFloorTruncation(
              text,
              config.max_price_digit
            );
            return <label className={data.color}>{price}</label>;
          },
        },
        {
          title: toLocale('spot.deals.amount').replace('-', tradeCurr),
          key: 'volume',
          render: (text) => {
            const amount = calc.showFloorTruncation(
              text,
              config.max_size_digit
            );
            return <label>{amount}</label>;
          },
        },
        {
          title: toLocale('spot.deals.time'),
          key: 'timestamp',
          render: (text) => {
            const dateTime = util.timeStampToTime(
              parseInt(text, 10),
              'yyyy-MM-dd hh:mm:ss'
            );
            const time = dateTime.split(' ')[1];
            return time;
          },
        },
      ];
    };

    getDealsEmpty = () => toLocale('spot.deals.no');

    startWs = (product) => {
      const { spotTradeActions } = this.props;
      wsV3.stop(channelsV3.getMatches(product));
      spotTradeActions.getDeals(product, () => {
        wsV3.send(channelsV3.getMatches(product));
      });
    };

    changeProduct = (oldproduct, newproduct) => {
      const { wsIsOnlineV3, spotTradeActions } = this.props;
      if (window.OK_GLOBAL.ws_v3 && wsIsOnlineV3) {
        wsV3.stop(channelsV3.getMatches(oldproduct));
        spotTradeActions.clearDeals();
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
