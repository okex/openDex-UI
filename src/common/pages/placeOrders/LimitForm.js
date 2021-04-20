import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputNum from '_component/InputNum';
import Tooltip from 'rc-tooltip';
import { toLocale } from '_src/locale/react-locale';
import { calc } from '_component/okit';
import config from '_src/constants/Config';
import { getDisplaySymbol } from '_src/utils/coinIcon';
import navigation from '../../utils/navigation';
import * as FormActions from '../../redux/actions/FormAction';
import StrategyTypeSelect from './StrategyTypeSelect';
import FormatNum from '../../utils/FormatNum';
import Available from '../../component/placeOrder/Available';
import LegalPrice from '../../component/placeOrder/LegalPrice';
import QuoteIncrement from '../../component/placeOrder/QuoteIncrement';
import SubmitButton from '../../component/placeOrder/SubmitButton';
import TradeSliderBar from '../../component/TradeSliderBar';
import Enum from '../../utils/Enum';
import util from '../../utils/util';

function mapStateToProps(state) {
  const { SpotTrade, FormStore } = state;
  const { product, currencyTicker, productObj } = SpotTrade;
  const { inputObjFromDepth, inputObj } = FormStore;
  return {
    product,
    inputObj,
    currencyTicker,
    inputObjFromDepth,
    productObj,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formActions: bindActionCreators(FormActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class LimitForm extends React.Component {
  static propTypes = {
    asset: PropTypes.object,
  };

  static defaultProps = {
    asset: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      inputObj: {
        price: '',
        amount: '',
        total: '',
      },
      isLoading: false,
      warning: '',
    };
    this.formParam = {};
  }

  componentDidMount() {
    const {
      currencyTicker,
      product,
      productObj,
      inputObjFromDepth,
    } = this.props;
    const { price, amount, total } = inputObjFromDepth;
    const initPrice =
      productObj && productObj[product] ? productObj[product].price : 0;
    let tickerPrice = 0;
    if (currencyTicker) {
      if (+currencyTicker.price === -1) {
        tickerPrice = initPrice;
      } else {
        tickerPrice = currencyTicker.price;
      }
    }
    this.updateInput({
      price: tickerPrice,
    });
    if (price || amount || total) {
      this.updateInput({
        price,
        amount,
        total,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      product,
      productObj,
      currencyTicker,
      type,
      inputObjFromDepth,
    } = nextProps;
    if (this.props.product !== product) {
      this.clearForm();
      this.updateWarning();
      const initPrice =
        productObj && productObj[product] ? productObj[product].price : 0;
      let tickerPrice = 0;
      if (currencyTicker) {
        if (+currencyTicker.price === -1) {
          tickerPrice = initPrice;
        } else {
          tickerPrice = currencyTicker.price;
        }
      }
      this.updateInput({
        price: tickerPrice,
      });
    }
    if (this.props.type !== type) {
      this.clearForm();
    }
    const { price, amount, total } = inputObjFromDepth;
    const {
      price: oldPrice,
      amount: oldAmount,
      total: oldTotal,
    } = this.props.inputObjFromDepth;
    if (price !== oldPrice || amount !== oldAmount || total !== oldTotal) {
      const input = { ...inputObjFromDepth };
      delete input.type;
      this.clearForm();
      this.updateWarning();
      this.updateInput(inputObjFromDepth);
    }
  }

  componentWillUnmount() {
    this.props.formActions.updateDepthInput({
      type: Enum.placeOrder.type.buy,
      price: '',
      amount: '',
      total: '',
      couponId: '',
    });
  }

  onBlurPrice = () => {
    const { productConfig } = window.OK_GLOBAL;
    const priceTruncate = productConfig.max_price_digit;
    const sizeTruncate = productConfig.max_size_digit;
    const { inputObj } = this.state;
    const input = { ...inputObj };
    if (input.amount.trim().length > 0 && input.price.trim().length > 0) {
      input.total = calc.ceilMul(input.amount, input.price, priceTruncate);
    } else if (input.total.trim().length > 0 && input.price.trim().length > 0) {
      input.amount = calc.floorDiv(input.total, input.price, sizeTruncate);
    }
    return this.updateInput(input);
  };

  onInputChange = (key) => (inputValue) => {
    const { inputObj } = this.state;
    const { productConfig } = window.OK_GLOBAL;
    const input = { ...inputObj };

    const priceTruncate = productConfig.max_price_digit || 4;
    const sizeTruncate = productConfig.max_size_digit || 4;

    const value = inputValue === '.' ? '' : inputValue;
    if (key === 'price') {
      input[key] = FormatNum.CheckInputNumber(value, priceTruncate);
      if (String(input.amount).trim() !== '') {
        const total = calc.ceilMul(input.amount, input.price, priceTruncate);
        if (total > 0) {
          input.total = total;
        } else {
          input.total = '';
        }
      } else if (String(input.total).trim() !== '') {
        if (Number(input.price) > 0) {
          const amount = calc.floorDiv(input.total, input.price, priceTruncate);
          if (amount > 0) {
            input.amount = amount;
          } else {
            input.amount = '';
          }
        }
      }
    } else if (key === 'amount') {
      input[key] = FormatNum.CheckInputNumber(value, sizeTruncate);
      if (String(input.price).trim() !== '' && Number(input.price) !== 0) {
        const total = calc.ceilMul(input.amount, input.price, priceTruncate);
        if (total > 0) {
          input.total = total;
        } else {
          input.total = '';
        }
      }
    } else if (key === 'total') {
      input[key] = FormatNum.CheckInputNumber(value, sizeTruncate);
      if (String(input.price).trim() !== '' && Number(input.price) !== 0) {
        const amount = calc.floorDiv(input.total, input.price, sizeTruncate);
        if (amount > 0) {
          input.amount = amount;
        } else {
          input.amount = '';
        }
      }
    }
    this.updateWarning('');
    this.updateInput(input);
  };

  onTradeSliderBarChange = (value) => {
    const { productConfig } = window.OK_GLOBAL;
    const { asset, type } = this.props;
    const { baseAvailable, tradeAvailable } = asset;
    const { inputObj } = this.state;
    const newInputObj = { ...inputObj };

    const barValue = calc.mul(value, 0.01);
    const priceTruncate =
      'max_price_digit' in productConfig ? productConfig.max_price_digit : 8;
    const sizeTruncate =
      'max_size_digit' in productConfig ? productConfig.max_size_digit : 8;

    if (newInputObj.price > 0) {
      if (type === Enum.placeOrder.type.buy) {
        if (baseAvailable === 0) {
          return false;
        }
        const currValue = calc.mul(baseAvailable, barValue);
        newInputObj.amount = calc.floorDiv(
          currValue,
          newInputObj.price,
          sizeTruncate
        );
        newInputObj.total = calc.floorTruncate(currValue, priceTruncate);
      } else {
        if (tradeAvailable === 0) {
          return false;
        }
        const currValue = calc.mul(tradeAvailable, barValue);
        newInputObj.amount = calc.floorTruncate(currValue, sizeTruncate);
        newInputObj.total = calc.floorMul(
          newInputObj.price,
          newInputObj.amount,
          priceTruncate
        );
      }
    } else {
      return false;
    }

    newInputObj.total = newInputObj.total > 0 ? newInputObj.total : '';
    newInputObj.amount = newInputObj.amount > 0 ? newInputObj.amount : '';
    return this.updateInput(newInputObj);
  };

  onOrderSubmit = () => {
    const isLogin = util.isLogined();
    if (!isLogin) {
      navigation.import();
      return false;
    }

    const { asset, type } = this.props;
    const { updateWarning } = this;
    const { inputObj, isLoading } = this.state;
    if (isLoading) return false;
    const { baseCurr, baseAvailable, tradeCurr, tradeAvailable } = asset;
    const { productConfig } = window.OK_GLOBAL;
    const { min_trade_size, max_price_digit } = productConfig;

    const tradePrice = Number(inputObj.price);
    const tradeAmount = Number(inputObj.amount);
    const totalMoney = Number(inputObj.total);

    let userBalance = 0;

    if (type === Enum.placeOrder.type.buy) {
      userBalance = baseAvailable;
    }
    if (type === Enum.placeOrder.type.sell) {
      userBalance = tradeAvailable;
    }

    if (String(tradePrice).trim() === '' || tradePrice === 0) {
      this.focus('price');
      return updateWarning(toLocale('spot.place.tips.price'));
    }
    if (String(tradeAmount).trim() === '' || tradeAmount === 0) {
      this.focus('amount');
      return updateWarning(toLocale('spot.place.tips.amount'));
    }
    if (String(totalMoney).trim() === '' || totalMoney === 0) {
      this.focus('total');
      return updateWarning(toLocale('spot.place.tips.total'));
    }
    if (type === Enum.placeOrder.type.buy) {
      if (
        Number(userBalance) <
        calc.floorMul(tradePrice, tradeAmount, max_price_digit)
      ) {
        return updateWarning(toLocale('spot.place.tips.money2'));
      }
    } else if (type === Enum.placeOrder.type.sell) {
      if (Number(userBalance) < tradeAmount) {
        return updateWarning(toLocale('spot.place.tips.money2'));
      }
    }

    if (tradeAmount < Number(min_trade_size)) {
      return updateWarning(
        `${
          toLocale('spot.place.tips.minsize') + min_trade_size
        } ${util.getSymbolShortName(tradeCurr)}`
      );
    }

    if (totalMoney <= 0) {
      return updateWarning(toLocale('spot.place.tips.greaterthan0'));
    }

    this.formParam = {
      product: `${tradeCurr}_${baseCurr}`,
      side: type,
      price: tradePrice,
      size: tradeAmount,
      quoteSize: totalMoney,
      orderType: 0,
    };
    updateWarning('');
    this.setLoading(true);

    return this.props.onSubmit(
      this.formParam,
      () => {
        this.clearForm();
        this.setLoading(false);
      },
      (res) => {
        if (res && res.msg) {
          this.updateWarning(res.msg);
        }
        this.setLoading(false);
      }
    );
  };

  getPercent = (baseAvailable, tradeAvailable) => {
    let percent = 0;
    const { productConfig } = window.OK_GLOBAL;
    const { type } = this.props;
    const { inputObj } = this.state;
    const { total, amount } = inputObj;
    const priceTruncate =
      'max_price_digit' in productConfig ? productConfig.max_price_digit : 2;
    const sizeTruncate =
      'max_size_digit' in productConfig ? productConfig.max_size_digit : 2;
    const truncatedBase = Number(
      calc.floorTruncate(baseAvailable, priceTruncate)
    );
    const truncatedTrade = Number(
      calc.floorTruncate(tradeAvailable, sizeTruncate)
    );
    if (type === Enum.placeOrder.type.buy) {
      percent =
        truncatedBase === 0 ? 0 : calc.div(Number(total), truncatedBase);
    } else {
      percent =
        truncatedTrade === 0 ? 0 : calc.div(Number(amount), truncatedTrade);
    }
    percent = percent > 1 ? 1 : percent;
    return Number((percent * 100).toFixed(2));
  };

  setLoading = (isLoading = false) => {
    this.setState({ isLoading });
  };

  focus = (id = '') => {
    const ele = document.querySelector(`input.limit-${id}`);
    ele && ele.focus();
  };

  updateInput = (inputObj) => {
    this.setState(Object.assign(this.state.inputObj, inputObj));
  };

  updateWarning = (warning = '') => {
    this.setState({ warning });
  };

  clearForm = () => {
    this.setState(
      Object.assign(this.state.inputObj, {
        amount: '',
        total: '',
        couponID: '',
      })
    );
  };

  renderPrice = () => {
    const { tradeType } = window.OK_GLOBAL;
    const { asset } = this.props;
    const { inputObj } = this.state;
    const price = inputObj.price === '--' ? '0' : inputObj.price;
    const { baseCurr, tradeCurr } = asset;
    let priceTitle = `${
      toLocale('spot.placeorder.pleaseEnter') + toLocale('spot.price')
    } (${baseCurr})`;
    const isFullTrade = tradeType === Enum.tradeType.fullTrade;
    if (!isFullTrade) {
      priceTitle = (
        <span className="input-title">
          <Tooltip placement="bottom" overlay={<QuoteIncrement />}>
            <label className="detail">{toLocale('spot.price')}</label>
          </Tooltip>
          &nbsp;(
          {baseCurr})
        </span>
      );
    }
    return (
      <div className="spot-price input-container">
        {isFullTrade ? null : priceTitle}
        <InputNum
          type="text"
          onChange={this.onInputChange('price')}
          onBlur={this.onBlurPrice}
          value={price}
          className="input-theme-controls limit-price"
          placeholder={isFullTrade ? priceTitle : null}
        />
        {config.needLegalPrice && (
          <LegalPrice currency={tradeCurr} value={price} />
        )}
      </div>
    );
  };

  renderAmount = () => {
    const { tradeType, productConfig } = window.OK_GLOBAL;
    const { asset } = this.props;
    const { inputObj } = this.state;
    const { tradeCurr } = asset;
    const tradeSymbol = util.getSymbolShortName(tradeCurr);
    let placeholder = `${
      toLocale('spot.placeorder.pleaseEnter') + toLocale('spot.amount')
    } (${tradeSymbol})`;
    if (tradeType === Enum.tradeType.normalTrade) {
      placeholder = `${toLocale('spot.place.tips.minsize')}${
        productConfig.min_trade_size
      }${tradeSymbol}`;
    }
    return (
      <div className="input-container">
        {tradeType === Enum.tradeType.normalTrade ? (
          <span className="input-title">
            {toLocale('spot.amount')} ({tradeSymbol})
          </span>
        ) : null}
        <InputNum
          type="text"
          onChange={this.onInputChange('amount')}
          value={inputObj.amount}
          className="input-theme-controls limit-amount"
          placeholder={placeholder}
        />
      </div>
    );
  };

  renderSliderBar = () => {
    const { asset, type } = this.props;
    const { baseAvailable, tradeAvailable } = asset;
    const isFullTrade = window.OK_GLOBAL.tradeType === Enum.tradeType.fullTrade;
    const sliderColor = type === Enum.placeOrder.type.buy ? 'green' : 'red';
    const percent = this.getPercent(baseAvailable, tradeAvailable);
    return (
      <TradeSliderBar
        value={percent}
        onChange={this.onTradeSliderBarChange}
        theme={isFullTrade ? 'dark' : 'light'}
        color={sliderColor}
      />
    );
  };

  renderTotal = () => {
    const { tradeType } = window.OK_GLOBAL;
    const { asset } = this.props;
    const { inputObj } = this.state;
    const { baseCurr } = asset;
    return (
      <div className="input-container">
        {tradeType === Enum.tradeType.normalTrade ? (
          <span className="input-title">
            {toLocale('spot.total')} ({getDisplaySymbol(baseCurr)})
          </span>
        ) : null}

        <InputNum
          type="text"
          onChange={this.onInputChange('total')}
          autoComplete="off"
          value={inputObj.total}
          className="input-theme-controls limit-total"
          placeholder={
            tradeType === Enum.tradeType.normalTrade
              ? null
              : `${
                  toLocale('spot.placeorder.pleaseEnter') +
                  toLocale('spot.total')
                } (${getDisplaySymbol(baseCurr)})`
          }
        />
      </div>
    );
  };

  render() {
    const { tradeType } = window.OK_GLOBAL;
    const { needWarning, asset, type } = this.props;
    const { isLoading, warning } = this.state;
    const isFullTrade = tradeType === Enum.tradeType.fullTrade;
    return (
      <div className="spot-trade-limit">
        <div className={isFullTrade ? '' : ''}>
          <StrategyTypeSelect
            strategyType={Enum.placeOrder.strategyType.limit}
          />
          {this.renderPrice()}
        </div>
        {this.renderAmount()}
        {this.renderSliderBar()}
        {this.renderTotal()}
        <Available asset={asset} type={type} />
        <SubmitButton
          type={type}
          unit={util.getSymbolShortName(asset.tradeCurr)}
          isMargin={asset.isMargin}
          isLoading={isLoading}
          onClick={this.onOrderSubmit}
          warning={needWarning ? warning : ''}
        />
      </div>
    );
  }
}
export default LimitForm;
