import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import Message from '_src/component/Message';
import util from '../../utils/util';
import Enum from '../../utils/Enum';
import './SpotPlaceOrder.less';
import * as FormAction from '../../redux/actions/FormAction';
import * as SpotAction from '../../redux/actions/SpotTradeAction';
import * as CommonAction from '../../redux/actions/CommonAction';
import LimitForm from '../placeOrders/LimitForm';
import PasswordDialog from '../../component/PasswordDialog';
import Config from '../../constants/Config';

function mapStateToProps(state) {
  const { SpotTrade, FormStore, Common } = state;
  const { product, currencyObjByName, currencyTicker, account } = SpotTrade;
  const { privateKey } = Common;
  return {
    product,
    currencyObjByName,
    account,
    currencyTicker,
    FormStore,
    privateKey,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
    formAction: bindActionCreators(FormAction, dispatch),
    spotAction: bindActionCreators(SpotAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class SpotPlaceOrder extends React.Component {
  constructor(props) {
    super(props);
    this.asset = {};
    this.formParam = {};
    this.state = {
      isLoading: false,
      isShowPwdDialog: false,
      type: Enum.placeOrder.type.buy,
    };
    this.successCallback = null;
    this.errorCallback = null;
  }

  componentDidMount() {
    const { formAction, currencyTicker } = this.props;
    formAction.updateInput({
      price: currencyTicker && currencyTicker.price,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { product, currencyTicker } = nextProps;
    if (this.props.product !== product) {
      const { formAction } = this.props;
      formAction.clearForm();
      formAction.updateWarning();
      formAction.updateInput({
        price: currencyTicker && currencyTicker.price,
      });
    }
  }

  onChangeType = (type) => {
    return () => {
      this.setState({
        type,
      });
      const { formAction } = this.props;
      formAction.updateType(type);
      formAction.updateWarning();
    };
  };
  onPwdEnter = (password) => {
    const { formAction, commonAction } = this.props;
    if (password.trim() === '') {
      return formAction.updateWarning(toLocale('spot.place.tips.pwd'));
    }
    formAction.updateWarning('');
    this.setState(
      {
        isLoading: true,
      },
      () => {
        setTimeout(() => {
          commonAction.validatePassword(
            password,
            (pk) => {
              const param = { ...this.formParam, pk };
              formAction.submitOrder(
                param,
                () => {
                  this.successToast();
                  this.onPwdClose();
                },
                this.onSubmitErr
              );
            },
            () => {
              this.setState({
                isLoading: false,
              });
            }
          );
        }, Config.validatePwdDeferSecond);
      }
    );
    return false;
  };
  onPwdOpen = () => {
    this.setState(
      {
        isShowPwdDialog: true,
      },
      () => {
        const o = window.document.getElementsByClassName('pwd-input');
        if (o && o[0] && o[0].focus) {
          o[0].focus();
        }
      }
    );
  };
  onPwdClose = () => {
    this.setState(
      {
        isShowPwdDialog: false,
        isLoading: false,
      },
      () => {
        this.errorCallback && this.errorCallback();
      }
    );
  };
  onSubmitErr = (err) => {
    this.onPwdClose();
    const { type } = this.state;
    const msg =
      type === Enum.placeOrder.type.buy
        ? toLocale('spot.orders.buyFail')
        : toLocale('spot.orders.sellFail');
    Message.error({ content: msg, duration: 3 });
  };
  onTransfer = () => {
    const { spotAction } = this.props;
    spotAction.updateMarginTransfer(true);
  };
  getAvailables = () => {
    const { product, account } = this.props;
    const tradeCurr =
      product && product.includes('_')
        ? product.split('_')[0].toUpperCase()
        : '';
    const baseCurr =
      product && product.includes('_')
        ? product.split('_')[1].toUpperCase()
        : '';
    const tradeAccount = account[tradeCurr.toLowerCase()];
    const baseAccount = account[baseCurr.toLowerCase()];
    const tradeAvailable = tradeAccount ? Number(tradeAccount.available) : 0;
    const baseAvailable = baseAccount ? Number(baseAccount.available) : 0;
    return {
      baseCurr,
      baseAvailable,
      tradeCurr,
      tradeAvailable,
    };
  };
  getStrategyForm = (strategyType) => {
    const { asset } = this;
    const { isShowPwdDialog, type } = this.state;
    const commonProps = {
      asset,
      type,
      onSubmit: this.handleSubmit,
      needWarning: !isShowPwdDialog,
    };
    switch (strategyType) {
      case Enum.placeOrder.strategyType.limit:
        return <LimitForm {...commonProps} />;
      default:
        return <LimitForm {...commonProps} />;
    }
  };
  successToast = () => {
    const { formAction } = this.props;
    formAction.clearForm();
    this.successCallback && this.successCallback();
    const { type } = this.state;
    const msg =
      type === Enum.placeOrder.type.buy
        ? toLocale('spot.orders.buySuccess')
        : toLocale('spot.orders.sellSuccess');
    Message.success({ content: msg, duration: 2 });
  };
  handleSubmit = (formParam, successCallback, errorCallback) => {
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    const { formAction } = this.props;
    formAction.updateWarning('');
    if (!util.isLogined()) {
      window.location.reload();
    }
    this.formParam = { ...formParam, product: this.props.product };
    const expiredTime = window.localStorage.getItem('pExpiredTime') || 0;
    if (new Date().getTime() < +expiredTime && this.props.privateKey) {
      const param = { ...this.formParam, pk: this.props.privateKey };
      return formAction.submitOrder(param, this.successToast, this.onSubmitErr);
    }
    return this.onPwdOpen();
  };
  renderTitle = () => {
    const { product } = this.props;
    const { type } = this.state;
    const tradeCurr = util.getSymbolShortName(
      product.split('_')[0].toUpperCase()
    );
    const buyInTitle = toLocale('spot.buyin', { currency: tradeCurr });
    const sellTitle = toLocale('spot.sellout', { currency: tradeCurr });
    return (
      <ul className="spot-tab-heads">
        <li
          className={type === Enum.placeOrder.type.buy ? 'active' : ''}
          onClick={this.onChangeType(Enum.placeOrder.type.buy)}
        >
          {buyInTitle}
        </li>
        <li
          className={type === Enum.placeOrder.type.sell ? 'active' : ''}
          onClick={this.onChangeType(Enum.placeOrder.type.sell)}
        >
          {sellTitle}
        </li>
      </ul>
    );
  };
  renderPwdDialog = () => {
    const { isShowPwdDialog, isLoading } = this.state;
    const { formAction, FormStore } = this.props;
    const { warning } = FormStore;
    const title = toLocale('please_input_pwd');
    return (
      <PasswordDialog
        title={title}
        btnLoading={isLoading}
        warning={warning}
        isShow={isShowPwdDialog}
        onEnter={this.onPwdEnter}
        onClose={this.onPwdClose}
        updateWarning={formAction.updateWarning}
      />
    );
  };

  render() {
    const { tradeType } = window.OK_GLOBAL;
    const { strategyType } = this.props.FormStore;
    const extraClassName =
      tradeType === Enum.tradeType.normalTrade ? 'flex10' : 'auto-stretch';
    this.asset = this.getAvailables();
    return (
      <div className={`spot-place-order-container ${extraClassName}`}>
        {this.renderTitle()}
        <div className={`spot-trade type-${strategyType}`}>
          {this.getStrategyForm(strategyType)}
          {this.renderPwdDialog()}
        </div>
      </div>
    );
  }
}
export default SpotPlaceOrder;
