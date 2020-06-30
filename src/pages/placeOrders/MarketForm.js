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

function mapStateToProps(state) { // 绑定redux中相关state
  const { SpotTrade } = state;
  const {
    currencyTicker, isShowTradePwd, symbol,
  } = SpotTrade;
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

@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
export default class MarketForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputObj: { // 下单的input值(由原来的reducer移动到这里)
        price: '',
        amount: '',
        total: ''
      },
      isLoading: false, // 下单按钮loading状态
      warning: '', // 错误信息
    };
    this.formParam = {}; // 表单参数
  }
  componentDidMount() {
    const { currencyPrice } = this.props;
    this.updateInput({
      price: currencyPrice
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      symbol, currencyTicker, type, asset
    } = nextProps;
    if (this.props.symbol !== symbol || this.props.asset.isMargin !== asset.isMargin) { // 切换币对
      this.clearForm();
      this.updateWarning();
      this.updateInput({
        price: currencyTicker.price
      });
    }
    if (this.props.type !== type) {
      this.clearForm();
    }
  }
  // 输入框 keyup
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
      /* 清空操作 */
      if (!inputValue.length) {
        input[key] = '';
        this.updateInput(input);
        return;
      }
      /* 非清空操作 */
      // 总金额小数位操作
      if (['total'].indexOf(key) > -1) {
        inputValue = FormatNum.CheckInputNumber(inputValue, priceTruncate);
      } else if (['amount'].indexOf(key) > -1) {
        // 数量操作
        // 保留小数位操作
        inputValue = FormatNum.CheckInputNumber(inputValue, sizeTruncate);
      }
      input[key] = inputValue;
      this.updateInput(input);
    };
  };
  // 输入改变
  onInputChange = (key) => {
    return (inputValue) => {
      const { inputObj } = this.state;
      const { productConfig } = window.OK_GLOBAL;
      const input = { ...inputObj };

      const priceTruncate = productConfig.max_price_digit;
      const sizeTruncate = productConfig.max_size_digit;
      // 非pwd输入，当输入只有.的时候，切换为空
      const value = inputValue === '.' ? '' : inputValue;
      if (key === 'total') {
        // 输入总金额
        input[key] = FormatNum.CheckInputNumber(value, priceTruncate);
      } else if (key === 'amount') {
        // 输入数量
        input[key] = FormatNum.CheckInputNumber(value, sizeTruncate);
      }
      this.updateWarning(''); // 清空错误提示
      this.updateInput(input); // 更新input值
    };
  };
  // 拖动百分比sliderBar
  onTradeSliderBarChange = (value) => {
    const { productConfig } = window.OK_GLOBAL;
    const { asset, type } = this.props;
    const { baseAvailable, tradeAvailable } = asset;
    const { inputObj } = this.state;
    const newInputObj = { ...inputObj };

    const barValue = value * 0.01;
    // 精度有可能是0
    const priceTruncate = 'max_price_digit' in productConfig ? productConfig.max_price_digit : 2;
    const sizeTruncate = 'max_size_digit' in productConfig ? productConfig.max_size_digit : 2;

    if (type === Enum.placeOrder.type.buy) { // 买单
      if (Number(baseAvailable) === 0) {
        return false;
      }
      newInputObj.total = calc.floorMul(baseAvailable, barValue, priceTruncate);
    } else { // 卖单
      if (Number(tradeAvailable) === 0) {
        return false;
      }
      newInputObj.amount = calc.floorMul(tradeAvailable, barValue, sizeTruncate);
    }

    newInputObj.total = newInputObj.total > 0 ? newInputObj.total : '';
    newInputObj.amount = newInputObj.amount > 0 ? newInputObj.amount : '';
    return this.updateInput(newInputObj);
  };
  // 提交表单
  onOrderSubmit = () => {
    const {
      type, asset, currencyPrice
    } = this.props;
    const { updateWarning } = this;
    const { inputObj } = this.state;
    const {
      isMargin, baseAvailable,
      tradeAvailable,
      tradeCurr
    } = asset;

    const { productConfig } = window.OK_GLOBAL;
    const min_trade_size = productConfig.min_trade_size;

    const tradePrice = inputObj.price;
    const tradeAmount = inputObj.amount;
    const totalMoney = inputObj.total;

    const tempParams = {
      price: tradePrice,
      size: tradeAmount,
      quoteSize: totalMoney
    };
    let userBalance = 0;
    if (type === Enum.placeOrder.type.buy) {
      userBalance = Number(baseAvailable);
    }
    if (type === Enum.placeOrder.type.sell) {
      userBalance = Number(tradeAvailable);
    }

    // 市价单 只做余额判断
    if (type === Enum.placeOrder.type.buy) { // 买
      // 检查 下单金额比当前价格的最小购买单位还少
      if (Number(totalMoney) < Number(calc.mul(currencyPrice, min_trade_size))) {
        updateWarning(toLocale('spot.place.tips.minbuy') + min_trade_size + tradeCurr);
        return false;
      }
      // 计价货币余额不足
      if (Number(userBalance) < Number(totalMoney)) {
        updateWarning(toLocale('spot.place.tips.money2'));
        return false;
      }
      tempParams.price = totalMoney;
    } else if (type === Enum.placeOrder.type.sell) { // 卖
      // 检查 交易金额小于当前币种 的最小购买单位，无法卖出
      if (Number(tradeAmount) < Number(min_trade_size)) {
        updateWarning(toLocale('spot.place.tips.minsell') + min_trade_size + tradeCurr);
        return false;
      }
      // 交易货币余额不足
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
      orderType: 1
    };
    updateWarning('');
    this.setLoading(true);
    return this.props.onSubmit(this.formParam, () => {
      this.clearForm();
      this.setLoading(false);
    }, (res) => {
      if (res && res.msg) {
        this.updateWarning(res.msg);
      }
      this.setLoading(false);
    });
  };
  // 获取sliderBar当前percent
  getPercent = (baseAvailable, tradeAvailable) => {
    let percent = 0;
    const { productConfig } = window.OK_GLOBAL;
    const { type } = this.props;
    const { inputObj } = this.state;
    const { total, amount } = inputObj;
    const priceTruncate = 'max_price_digit' in productConfig ? productConfig.max_price_digit : 2;
    const sizeTruncate = 'max_size_digit' in productConfig ? productConfig.max_size_digit : 2;
    if (type === Enum.placeOrder.type.buy) { // 买单，根据总金额计算百分比
      percent = baseAvailable === 0 ? 0 : calc.div(Number(total), calc.floorTruncate(baseAvailable, priceTruncate));
    } else { // 卖单，根据数量计算百分比
      percent = tradeAvailable === 0 ? 0 : calc.div(Number(amount), calc.floorTruncate(tradeAvailable, sizeTruncate));
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
    this.setState(Object.assign(this.state.inputObj, {
      amount: '',
      total: ''
    }));
  };
  // 价格
  renderPrice = () => {
    const { tradeType } = window.OK_GLOBAL;
    if (tradeType === Enum.tradeType.normalTrade) {
      return null;
    }
    return (
      <span
        style={{
          color: 'rgba(255,255,255,0.3)',
          marginLeft: '20px'
        }}
        className="flex-row vertical-middle"
      >
        {toLocale('spot.place.marketPrice')}
      </span>
    );
  };
  // 滑动条
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

  // 买入只显示总金额
  renderTotal = () => {
    const { tradeType } = window.OK_GLOBAL;
    const { asset, type } = this.props;
    const { inputObj } = this.state;
    const { baseCurr } = asset;
    if (type === Enum.placeOrder.type.buy) {
      return (
        <div className="input-container">
          {tradeType === Enum.tradeType.normalTrade ?
            <span className="input-title">
              {toLocale('spot.total')} ({baseCurr})
            </span>
              :
              null
            }

          <InputNum
            type="text"
            onKeyUp={this.onInputKeyUp('total')}
            onChange={this.onInputChange('total')}
            autoComplete="off"
            value={inputObj.total}
            className="input-theme-controls"
            placeholder={tradeType === Enum.tradeType.normalTrade ? null : `${toLocale('spot.placeorder.pleaseEnter') + toLocale('spot.total')} (${baseCurr})`}
          />
        </div>
      );
    }
    return null;
  };
  // 卖出只显示数量
  renderAmount = () => {
    const { tradeType, productConfig } = window.OK_GLOBAL;
    const { asset, type } = this.props;
    const { inputObj } = this.state;
    const { tradeCurr } = asset;
    let placeholder = `${toLocale('spot.placeorder.pleaseEnter')
    + toLocale('spot.amount')} (${tradeCurr})`;
    if (tradeType === Enum.tradeType.normalTrade) {
      // 非全屏模式
      placeholder = `${toLocale('spot.place.tips.minsize')}${productConfig.min_trade_size}${tradeCurr}`;
    }
    if (type === Enum.placeOrder.type.sell) {
      return (
        <div className="input-container">
          {tradeType === Enum.tradeType.normalTrade ?
            <span className="input-title">
              {toLocale('spot.amount')} ({tradeCurr})
            </span> : null}
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
          <StrategyTypeSelect strategyType={Enum.placeOrder.strategyType.market} />
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
