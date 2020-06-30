import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
// import { calc } from '_component/okit';
import Message from '_src/component/Message';
// import Dialog from '_component/Dialog/src/Dialog';
import { Dialog } from '_component/Dialog';
import Icon from '_src/component/IconLite';
import util from '../../utils/util';
import Enum from '../../utils/Enum';
import './SpotPlaceOrder.less';
import * as FormAction from '../../redux/actions/FormAction';
import * as SpotAction from '../../redux/actions/SpotTradeAction';
import * as CommonAction from '../../redux/actions/CommonAction';
import LimitForm from '../placeOrders/LimitForm';
import PasswordDialog from '../../component/PasswordDialog';
import Config from '../../constants/Config';


function mapStateToProps(state) { // 绑定redux中相关state
  const { SpotTrade, FormStore, Common } = state;
  const {
    product, currencyObjByName, currencyTicker, account
  } = SpotTrade;
  const { privateKey } = Common;
  return {
    product,
    currencyObjByName, // 获取杠杆资产日利率
    account,
    currencyTicker, // 切换币对时，重置默认价格
    FormStore,
    privateKey
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
    formAction: bindActionCreators(FormAction, dispatch),
    spotAction: bindActionCreators(SpotAction, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
class SpotPlaceOrder extends React.Component {
  constructor(props) {
    super(props);
    this.asset = {}; // 资产-各种表单都需要
    this.formParam = {}; // 表单提交参数
    this.state = {
      isLoading: false,
      isShowPwdDialog: false, // 资金密码弹窗
      type: Enum.placeOrder.type.buy, // 买或卖
    };
    this.successCallback = null;
    this.errorCallback = null;
  }

  componentDidMount() {
    const { formAction, currencyTicker } = this.props;
    formAction.updateInput({
      price: (currencyTicker && currencyTicker.price)
    });
  }

  componentWillReceiveProps(nextProps) {
    const { product, currencyTicker } = nextProps;
    if (this.props.product !== product) { // 切换币对
      const { formAction } = this.props;
      formAction.clearForm();
      formAction.updateWarning();
      formAction.updateInput({
        price: (currencyTicker && currencyTicker.price)
      });
    }
  }

  // 买卖切换
  onChangeType = (type) => {
    return () => {
      this.setState({
        type
      });
      const { formAction } = this.props;
      // 切换买卖类型
      formAction.updateType(type);
      // 清空下单报错
      formAction.updateWarning();
    };
  };
  // 资金密码弹窗点击提交
  onPwdEnter = (password) => {
    const { formAction, commonAction } = this.props;
    if (password.trim() === '') {
      return formAction.updateWarning(toLocale('spot.place.tips.pwd'));
    }
    formAction.updateWarning('');
    this.setState({
      isLoading: true,
    }, () => {
      setTimeout(() => {
        commonAction.validatePassword(password, (pk) => {
          const param = { ...this.formParam, pk };
          formAction.submitOrder(param, () => {
            this.successToast();
            this.onPwdClose();
          }, this.onSubmitErr);
        }, () => {
          this.setState({
            isLoading: false,
          });
        });
      }, Config.validatePwdDeferSecond);
    });
    return false;
  };
  // 开启资金密码弹窗
  onPwdOpen = () => {
    this.setState({
      isShowPwdDialog: true
    }, () => {
      const o = window.document.getElementsByClassName('pwd-input');
      if (o && o[0] && o[0].focus) {
        o[0].focus();
      }
    });
  };
  // 关闭资金密码弹窗
  onPwdClose = () => {
    this.setState({
      isShowPwdDialog: false,
      isLoading: false,
    }, () => {
      this.errorCallback && this.errorCallback();
    });
  };
  // 后端返回失败时
  onSubmitErr = (err) => {
    this.onPwdClose();
    const { type } = this.state;
    const msg = (type === Enum.placeOrder.type.buy) ? toLocale('spot.orders.buyFail') : toLocale('spot.orders.sellFail');
    // setTimeout(() => {
    //   const dialog = Dialog.show({
    //     theme: 'dark operate-alert',
    //     hideCloseBtn: true,
    //     children: <div className="operate-msg"><Icon className="icon-icon_fail" isColor />{msg}</div>,
    //   });
    //   setTimeout(() => {
    //     dialog.destroy();
    //   }, Config.operateResultTipInterval);
    // }, Config.operateResultDelaySecond);
    Message.error({ content: msg, duration: 3 });
  };
  // 资金划转
  onTransfer = () => {
    const { spotAction } = this.props;
    spotAction.updateMarginTransfer(true);
  };
  // 获取baseCurr和tradeCurr及对应额度
  getAvailables = () => {
    const {
      product, account
    } = this.props;
    const tradeCurr = (product && product.includes('_')) ? product.split('_')[0].toUpperCase() : '';
    const baseCurr = (product && product.includes('_')) ? product.split('_')[1].toUpperCase() : '';
    // let baseAvailable = 0;
    // let tradeAvailable = 0;
    const tradeAccount = account[tradeCurr.toLowerCase()];
    const baseAccount = account[baseCurr.toLowerCase()];
    // if (tradeAccount && baseAccount) {
    //   tradeAvailable = Number(tradeAccount.available);
    //   baseAvailable = Number(baseAccount.available);
    // }
    const tradeAvailable = tradeAccount ? Number(tradeAccount.available) : 0;
    const baseAvailable = baseAccount ? Number(baseAccount.available) : 0;
    return {
      baseCurr,
      baseAvailable,
      tradeCurr,
      tradeAvailable
    };
  };
  // 获取不同策略委托表单
  getStrategyForm = (strategyType) => {
    const { asset } = this;
    const { isShowPwdDialog, type } = this.state;
    /*
    * 子表单通用props
    * asset：资产
    * onSubmit：提交按钮钩子
    * needWarning： 是否显示错误提示
    * */
    const commonProps = {
      asset,
      type,
      onSubmit: this.handleSubmit,
      needWarning: !isShowPwdDialog
    };
    switch (strategyType) {
      case Enum.placeOrder.strategyType.limit:
        return <LimitForm {...commonProps} />;
      default:
        return <LimitForm {...commonProps} />;
    }
  };
  // 下单成功提示
  successToast = () => {
    const { formAction } = this.props;
    formAction.clearForm();
    this.successCallback && this.successCallback();
    const { type } = this.state;
    const msg = (type === Enum.placeOrder.type.buy) ? toLocale('spot.orders.buySuccess') : toLocale('spot.orders.sellSuccess');
    // setTimeout(() => {
    //   const dialog = Dialog.show({
    //     theme: 'dark operate-alert',
    //     hideCloseBtn: true,
    //     children: <div className="operate-msg"><Icon className="icon-icon_success" isColor />{msg}</div>,
    //   });
    //   setTimeout(() => {
    //     dialog.destroy();
    //   }, Config.operateResultTipInterval);
    // }, Config.operateResultDelaySecond);
    Message.success({ content: msg, duration: 2 });
  };
  // 子表单点击提交
  handleSubmit = (formParam, successCallback, errorCallback) => {
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    const { formAction } = this.props;
    formAction.updateWarning('');
    // 2019-08-13 增加用户清空全部缓存的判断
    if (!util.isLogined()) {
      window.location.reload();
    }
    this.formParam = { ...formParam, product: this.props.product };
    // 检查私钥，如果未过期直接取私钥，如果过期显示弹窗
    const expiredTime = window.localStorage.getItem('pExpiredTime') || 0;
    // 小于30分钟，且privateKey，（true时），不需要输入密码，直接提交
    if ((new Date().getTime() < +expiredTime) && this.props.privateKey) {
      const param = { ...this.formParam, pk: this.props.privateKey };
      return formAction.submitOrder(param, this.successToast, this.onSubmitErr);
    }
    return this.onPwdOpen();
  };
  // 买卖title
  renderTitle = () => {
    const { product } = this.props;
    const { type } = this.state;
    const tradeCurr = util.getSymbolShortName(product.split('_')[0].toUpperCase());
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
  // 资金密码弹窗
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
    const extraClassName = tradeType === Enum.tradeType.normalTrade ? 'flex10' : 'auto-stretch';
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

