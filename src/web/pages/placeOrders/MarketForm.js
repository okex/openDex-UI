import React from 'react';
import { connect } from 'react-redux';
import InputNum from '_component/InputNum';
import { toLocale } from '_src/locale/react-locale';
import { calc } from '_component/okit';
import Enum from '../../utils/Enum';
import FormatNum from '../../utils/FormatNum';
import util from '../../utils/util';
import StrategyTypeSelect from '../placeOrders/StrategyTypeSelect';
import TradeSliderBar from '../../component/TradeSliderBar';
import Available from '../../component/placeOrder/Available';
import SubmitButton from '../../component/placeOrder/SubmitButton';
import URL from '../../constants/URL';

function mapStateToProps(state) {
  const { SpotTrade } = state;
  const { currencyTicker, isShowTradePwd, symbol } = SpotTrade;
  const currencyPrice = currencyTicker.price;
  return {
    symbol,
    currencyTicker,
    currencyPrice,
    isShowTradePwd,
  };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MarketForm extends React.Component {
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
    const { currencyPrice } = this.props;
    this.updateInput({
      price: currencyPrice,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { symbol, currencyTicker, type, asset } = nextProps;
    if (
      this.props.symbol !== symbol ||
      this.props.asset.isMargin !== asset.isMargin
    ) {
      this.clearForm();
      this.updateWarning();
      this.updateInput({
        price: currencyTicker.price,
      });
    }
    if (this.props.type !== type) {
      this.clearForm();
    }
  }
  onInputKeyUp = (key) => {
    return (value, e) => {
      const config = window.OK_GLOBAL.productConfig;
      const { inputObj } = this.state;
      const priceTruncate = config.max_price_digit;
      const sizeTruncate = config.max_size_digit;

      if (util.ctrlAorTab(e)) {
        return;
      }
      const input = { ...inputObj };

      let inputValue = value;
      inputValue = inputValue.replace(/\s+/g, '');
      if (!inputValue.length) {
        input[key] = '';
        this.updateInput(input);
        return;
      }
      if (['total'].indexOf(key) > -1) {
        inputValue = FormatNum.CheckInputNumber(inputValue, priceTruncate);
      } else if (['amount'].indexOf(key) > -1) {
        inputValue = FormatNum.CheckInputNumber(inputValue, sizeTruncate);
      }
      input[key] = inputValue;
      this.updateInput(input);
    };
  };
  onInputChange = (key) => {
    return (inputValue) => {
      const { inputObj } = this.state;
      const { productConfig } = window.OK_GLOBAL;
      const input = { ...inputObj };

      const priceTruncate = productConfig.max_price_digit;
      const sizeTruncate = productConfig.max_size_digit;
      const value = inputValue === '.' ? '' : inputValue;
      if (key === 'total') {
        input[key] = FormatNum.CheckInputNumber(value, priceTruncate);
      } else if (key === 'amount') {
        input[key] = FormatNum.CheckInputNumber(value, sizeTruncate);
      }
      this.updateWarning('');
      this.updateInput(input);
    };
  };
  onTradeSliderBarChange = (value) => {
    const { productConfig } = window.OK_GLOBAL;
    const { asset, type } = this.props;
    const { baseAvailable, tradeAvailable } = asset;
    const { inputObj } = this.state;
    const newInputObj = { ...inputObj };

    const barValue = value * 0.01;
    const priceTruncate =
      'max_price_digit' in productConfig ? productConfig.max_price_digit : 2;
    const sizeTruncate =
      'max_size_digit' in productConfig ? productConfig.max_size_digit : 2;

    if (type === Enum.placeOrder.type.buy) {
      if (Number(baseAvailable) === 0) {
        return false;
      }
      newInputObj.total = calc.floorMul(baseAvailable, barValue, priceTruncate);
    } else {
      if (Number(tradeAvailable) === 0) {
        return false;
      }
      newInputObj.amount = calc.floorMul(
        tradeAvailable,
        barValue,
        sizeTruncate
      );
    }

    newInputObj.total = newInputObj.total > 0 ? newInputObj.total : '';
    newInputObj.amount = newInputObj.amount > 0 ? newInputObj.amount : '';
    return this.updateInput(newInputObj);
  };
  onOrderSubmit = () => {
    const { type, asset, currencyPrice } = this.props;
    const { updateWarning } = this;
    const { inputObj } = this.state;
    const { isMargin, baseAvailable, tradeAvailable, tradeCurr } = asset;

    const { productConfig } = window.OK_GLOBAL;
    const min_trade_size = productConfig.min_trade_size;

    const tradePrice = inputObj.price;
    const tradeAmount = inputObj.amount;
    const totalMoney = inputObj.total;

    const tempParams = {
      price: tradePrice,
      size: tradeAmount,
      quoteSize: totalMoney,
    };
    let userBalance = 0;
    if (type === Enum.placeOrder.type.buy) {
      userBalance = Number(baseAvailable);
    }
    if (type === Enum.placeOrder.type.sell) {
      userBalance = Number(tradeAvailable);
    }

    if (type === Enum.placeOrder.type.buy) {
      if (
        Number(totalMoney) < Number(calc.mul(currencyPrice, min_trade_size))
      ) {
        updateWarning(
          toLocale('spot.place.tips.minbuy') + min_trade_size + tradeCurr
        );
        return false;
      }
      if (Number(userBalance) < Number(totalMoney)) {
        updateWarning(toLocale('spot.place.tips.money2'));
        return false;
      }
      tempParams.price = totalMoney;
    } else if (type === Enum.placeOrder.type.sell) {
      if (Number(tradeAmount) < Number(min_trade_size)) {
        updateWarning(
          toLocale('spot.place.tips.minsell') + min_trade_size + tradeCurr
        );
        return false;
      }
      if (Number(userBalance) < Number(tradeAmount)) {
        updateWarning(toLocale('spot.place.tips.money2'));
        return false;
      }
      tempParams.size = tradeAmount;
    }
    this.formParam = {
      postUrl: URL.POST_SUBMIT_ORDER,
      side: type,
      price: tempParams.price,
      size: tempParams.size,
      systemType: isMargin ? Enum.spotOrMargin.margin : Enum.spotOrMargin.spot,
      quoteSize: tempParams.quoteSize,
      orderType: 1,
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
    if (type === Enum.placeOrder.type.buy) {
      percent =
        baseAvailable === 0
          ? 0
          : calc.div(
              Number(total),
              calc.floorTruncate(baseAvailable, priceTruncate)
            );
    } else {
      percent =
        tradeAvailable === 0
          ? 0
          : calc.div(
              Number(amount),
              calc.floorTruncate(tradeAvailable, sizeTruncate)
            );
    }
    percent = percent > 1 ? 1 : percent;
    return Number((percent * 100).toFixed(2));
  };
  setLoading = (isLoading = false) => {
    this.setState({ isLoading });
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
      })
    );
  };
  renderPrice = () => {
    const { tradeType } = window.OK_GLOBAL;
    if (tradeType === Enum.tradeType.normalTrade) {
      return null;
    }
    return (
      <span
        style={{
          color: 'rgba(255,255,255,0.3)',
          marginLeft: '20px',
        }}
        className="flex-row vertical-middle"
      >
        {toLocale('spot.place.marketPrice')}
      </span>
    );
  };
  renderSliderBar = () => {
    const { asset, type } = this.props;
    const { baseAvailable, tradeAvailable } = asset;
    const isFullTrade = window.OK_GLOBAL.tradeType === Enum.tradeType.fullTrade;
    const sliderType = type === Enum.placeOrder.type.buy ? 'green' : 'red';

    const percent = this.getPercent(baseAvailable, tradeAvailable);
    return (
      <TradeSliderBar
        value={percent}
        color={sliderType}
        theme={isFullTrade ? 'dark' : 'light'}
        onChange={this.onTradeSliderBarChange}
      />
    );
  };

  renderTotal = () => {
    const { tradeType } = window.OK_GLOBAL;
    const { asset, type } = this.props;
    const { inputObj } = this.state;
    const { baseCurr } = asset;
    if (type === Enum.placeOrder.type.buy) {
      return (
        <div className="input-container">
          {tradeType === Enum.tradeType.normalTrade ? (
            <span className="input-title">
              {toLocale('spot.total')} ({baseCurr})
            </span>
          ) : null}

          <InputNum
            type="text"
            onKeyUp={this.onInputKeyUp('total')}
            onChange={this.onInputChange('total')}
            autoComplete="off"
            value={inputObj.total}
            className="input-theme-controls"
            placeholder={
              tradeType === Enum.tradeType.normalTrade
                ? null
                : `${
                    toLocale('spot.placeorder.pleaseEnter') +
                    toLocale('spot.total')
                  } (${baseCurr})`
            }
          />
        </div>
      );
    }
    return null;
  };
  renderAmount = () => {
    const { tradeType, productConfig } = window.OK_GLOBAL;
    const { asset, type } = this.props;
    const { inputObj } = this.state;
    const { tradeCurr } = asset;
    let placeholder = `${
      toLocale('spot.placeorder.pleaseEnter') + toLocale('spot.amount')
    } (${tradeCurr})`;
    if (tradeType === Enum.tradeType.normalTrade) {
      placeholder = `${toLocale('spot.place.tips.minsize')}${
        productConfig.min_trade_size
      }${tradeCurr}`;
    }
    if (type === Enum.placeOrder.type.sell) {
      return (
        <div className="input-container">
          {tradeType === Enum.tradeType.normalTrade ? (
            <span className="input-title">
              {toLocale('spot.amount')} ({tradeCurr})
            </span>
          ) : null}
          <InputNum
            type="text"
            onKeyUp={this.onInputKeyUp('amount')}
            onChange={this.onInputChange('amount')}
            value={inputObj.amount}
            className="input-theme-controls"
            placeholder={placeholder}
          />
        </div>
      );
    }
    return null;
  };

  render() {
    const { tradeType } = window.OK_GLOBAL;
    const { needWarning, asset, type } = this.props;
    const { warning, isLoading } = this.state;
    const isFullTrade = tradeType === Enum.tradeType.fullTrade;
    return (
      <div className="spot-trade-market">
        <div className={isFullTrade ? 'flex-row mar-bot8' : ''}>
          <StrategyTypeSelect
            strategyType={Enum.placeOrder.strategyType.market}
          />
          {this.renderPrice()}
        </div>
        {this.renderSliderBar()}
        {this.renderTotal()}
        {this.renderAmount()}
        <Available asset={asset} type={type} />
        <SubmitButton
          type={type}
          unit={asset.tradeCurr}
          isMargin={asset.isMargin}
          isLoading={isLoading}
          onClick={this.onOrderSubmit}
          warning={needWarning ? warning : ''}
        />
      </div>
    );
  }
}
