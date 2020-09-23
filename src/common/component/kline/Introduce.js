import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import util from '../../utils/util';

import './Introduce.less';

function mapStateToProps(state) {
  return {
    product: state.SpotTrade.product,
    currencyObjByName: state.SpotTrade.currencyObjByName,
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
      introduceObj: {},
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
    const currencyObj = this.props.currencyObjByName;
    const o = currencyObj[currency];
    if (o) {
      this.setState({
        introduceObj: {
          name: o.description ? o.description : '',
          whole_name: o.whole_name ? o.whole_name : '',
          original_symbol: o.original_symbol ? o.original_symbol : '',
          total_supply: o.total_supply ? o.total_supply : '',
        },
      });
    }
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
          {toLocale('symbolWholeName')} {`${introduceObj.whole_name}`} <br />
          <br />
          {toLocale('symbolId')} {`${currency}`} <br />
          <br />
          {toLocale('symbolDesc')} {`${introduceObj.name}`}
        </div>
      </div>
    );
  }
}
export default Introduce;
