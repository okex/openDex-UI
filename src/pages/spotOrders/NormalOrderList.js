import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import { Dialog } from "_component/Dialog";
import Icon from '_src/component/IconLite';
import { calc } from '_component/okit';
import Loading from '_component/Loading';
import PageURL from '_constants/PageURL';
import Table from '../../component/ok-table';
import commonUtil from './commonUtil';
import normalColumns from './normalColumns';
import Enum from '../../utils/Enum';
import * as OrderAction from '../../redux/actions/OrderAction';
import * as SpotAction from '../../redux/actions/SpotAction';
import * as CommonAction from "../../redux/actions/CommonAction";
import PasswordDialog from '../../component/PasswordDialog';
import Message from "_src/component/Message";
import * as FormAction from "../../redux/actions/FormAction";
import Config from "../../constants/Config";
import { Link } from 'react-router-dom';
import util from '../../utils/util';

function mapStateToProps(state) { // 绑定redux中相关state
  const { theme, wsIsOnline } = state.Spot;
  const { productObj, product } = state.SpotTrade;
  const { type, entrustType, data, isHideOthers, periodIntervalType } = state.OrderStore;
  const { privateKey } = state.Common;
  const { FormStore } = state;
  return {
    theme, wsIsOnline, productObj, product, type, entrustType, data, privateKey, FormStore, isHideOthers, periodIntervalType
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    orderAction: bindActionCreators(OrderAction, dispatch),
    formAction: bindActionCreators(FormAction, dispatch),
    spotAction: bindActionCreators(SpotAction, dispatch),
    commonAction: bindActionCreators(CommonAction, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
export default class NormalOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowPwdDialog: false, // 资金密码弹窗
      cancelLoading: false // 取消订单期间的loading状态
    };
    this.targetNode = null;
  }

  handleCommonParam(periodInterval) {
    let start = new Date();
    const end = Math.floor(new Date().getTime() / 1000);
    if (periodInterval === Enum.order.periodInterval.oneDay) {
      start = start.setDate(start.getDate() - 1);
    } else if (periodInterval === Enum.order.periodInterval.oneWeek) {
      start = start.setDate(start.getDate() - 7);
    } else if (periodInterval === Enum.order.periodInterval.oneMonth) {
      start = start.setDate(start.getDate() - 30);
    } else if (periodInterval === Enum.order.periodInterval.threeMonth) {
      start = start.setDate(start.getDate() - 90);
    }
    start = Math.floor(new Date(start).getTime() / 1000);
    return {
      start,
      end
    };
  }

  // 撤销订单
  onCancelOrder = (order) => {
    return (e) => {
      e.persist(); // 移出事件池从而保留事件对象

      // 2019-08-13 增加用户清空全部缓存的判断
      if (!util.isLogined()) {
        window.location.reload();
      }

      const order_id = order.order_id;
      let title = toLocale('spot.myOrder.cancelPartDealTip');
      if ((order.quantity - order.remain_quantity) === 0) { // 未成交
        title = toLocale('spot.myOrder.cancelNoDealTip');
      }
      const dialog = Dialog.confirm({
        title: title,
        confirmText: toLocale('ensure'),
        cancelText: toLocale('cancel'),
        theme: 'dark',
        dialogId: 'okdex-confirm',
        windowStyle: {
          background: '#112F62'
        },
        onConfirm: () => {
          dialog.destroy();
          if (Number(e.target.getAttribute('canceling'))) {
            return;
          }
          e.target.setAttribute('canceling', 1);
          this.targetNode = e.target;
          this.formParam = { order_id };
          // const startEndObj = this.handleCommonParam(this.props.periodIntervalType);
          // this.formParam = {  ...this.formParam, start: startEndObj.start, end: startEndObj.end };
          if (this.props.isHideOthers && this.props.product) {
            this.formParam = { ...this.formParam, product: this.props.product };
          }
          // 检查私钥，如果未过期直接取私钥，如果过期显示弹窗
          const expiredTime = window.localStorage.getItem('pExpiredTime') || 0;
          // 小于30分钟，且privateKey，（true时），不需要输入密码，直接提交
          if ((new Date().getTime() < +expiredTime) && this.props.privateKey) {
            const param = { ...this.formParam, pk: this.props.privateKey };
            this.setState({
              isShowPwdDialog: false,
              cancelLoading: true
            }, () => {
              e.target.setAttribute('canceling', 0);
              this.props.orderAction.cancelOrder(param, this.successToast, this.onSubmitErr);
            });
            // return this.props.orderAction.cancelOrder(param, this.successToast, this.onSubmitErr);
          } else {
            e.target.setAttribute('canceling', 0);
            this.onPwdOpen();
          }
          // return this.onPwdOpen();
        },
      });
    };
  };
  // 页码改变
  onPageChange = (page) => {
    this.props.orderAction.getOrderList({ page });
  };

  // 渲染页码
  renderPagination = (theme) => {
    const { entrustType, type, data } = this.props;
    // if (entrustType === Enum.order.entrustType.normal) {
    //   return null;
    // }
    const { page } = data;
    return commonUtil.renderPagination(page, type, this.onPageChange, theme);
  };
  // 下单成功提示
  successToast = () => {
    this.successCallback && this.successCallback();

    // setTimeout(() => {
    //   this.setState({cancelLoading: false});
    //   const dialog = Dialog.show({
    //     theme: 'dark operate-alert',
    //     hideCloseBtn: true,
    //     children: <div className="operate-msg"><Icon className="icon-icon_success" isColor />{toLocale('spot.myOrder.cancelSuccessed')}</div>,
    //   });
    //   setTimeout(() => {
    //     dialog.destroy();
    //   }, Config.operateResultTipInterval);
    // }, Config.operateResultDelaySecond);
    this.setState({cancelLoading: false});
    Message.success({ content: toLocale('spot.myOrder.cancelSuccessed'), duration: 3 });
  };
  // 后端返回失败时
  onSubmitErr = (err) => {
    this.onPwdClose();
    this.targetNode.removeAttribute('canceling');
    this.errorCallback && this.errorCallback(err);

    // setTimeout(() => {
    //   this.setState({cancelLoading: false});
    //   const dialog = Dialog.show({
    //     theme: 'dark operate-alert',
    //     hideCloseBtn: true,
    //     children: <div className="operate-msg"><Icon className="icon-icon_fail" isColor />{toLocale('spot.myOrder.cancelFailed')}</div>,
    //   });
    //   setTimeout(() => {
    //     dialog.destroy();
    //   }, Config.operateResultTipInterval);
    // }, Config.operateResultDelaySecond);
    this.setState({cancelLoading: false});
    Message.error({ content: toLocale('spot.myOrder.cancelFailed'), duration: 3 });
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
      isLoading: false,
      isShowPwdDialog: false
    }, () => {
      this.errorCallback && this.errorCallback();
    });
  };
  // 资金密码弹窗点击提交
  onPwdEnter = (password) => {
    const { formAction, orderAction, commonAction } = this.props;
    if (password.trim() === '') {
      return formAction.updateWarning(toLocale('spot.place.tips.pwd'));
    }
    formAction.updateWarning('');
    this.setState({
      isLoading: true
    }, () => {
      setTimeout(() => {
        commonAction.validatePassword(password, (pk) => {
          const param = { ...this.formParam, pk };
          this.setState({
            isShowPwdDialog: false,
            cancelLoading: true
          }, () => {
            orderAction.cancelOrder(param, () => {
              this.successToast();
              this.onPwdClose();
            }, this.onSubmitErr);
          });
        }, () => {
          this.setState({
            isLoading: false
          });
        });
      }, Config.validatePwdDeferSecond)
    });
    return false;
  };
  // 资金密码弹窗
  renderPwdDialog = () => {
    const { isLoading, isShowPwdDialog } = this.state;
    const { warning } = this.props.FormStore;
    const title = toLocale('please_input_pwd');
    return (
      <PasswordDialog
        title={title}
        btnLoading={isLoading}
        warning={warning}
        updateWarning={this.props.formAction.updateWarning}
        isShow={isShowPwdDialog}
        onEnter={this.onPwdEnter}
        onClose={this.onPwdClose}
      />
    );
  };
  render() {
    const { tradeType } = window.OK_GLOBAL;
    const tableTheme = tradeType === Enum.tradeType.fullTrade ? 'dark' : '';
    const { data, theme, type, product, productObj, isHideOthers, spotAction } = this.props;
    const { isLoading, orderList, page } = data;
    const {total} = page;
    const pageTheme = theme === Enum.themes.theme2 ? 'dark' : '';
    let columns = [];
    let dataSource = [];
    let path = 'open';
    if (type === Enum.order.type.noDeal || type === Enum.order.type.history) {
      if (orderList.length && orderList[0].uniqueKey) {
        dataSource = [];
      }
    }
    if (type === Enum.order.type.noDeal) {
      dataSource = commonUtil.formatOpenData(orderList, productObj, product);
      columns = normalColumns.noDealColumns(this.onCancelOrder, spotAction.updateProduct);
    } else if (type === Enum.order.type.history) {
      dataSource = commonUtil.formatClosedData(orderList, productObj);
      columns = normalColumns.historyColumns();
      path = 'history';
    } else if (type === Enum.order.type.detail) {
      dataSource = commonUtil.formatDealsData(orderList, productObj);
      columns = normalColumns.detailColumns();
      path = 'deals';
    }
    let queryProduct = 'all';
    if (isHideOthers && product) {
      queryProduct = product;
    }
    // 跳转链接参数：, period: this.props.periodIntervalType 'product=' + queryProduct
    return (
      <div>
        <Table
          columns={columns}
          isLoading={isLoading}
          dataSource={dataSource}
          empty={commonUtil.getEmpty()}
          rowKey={type === Enum.order.type.detail ? "uniqueKey" : "order_id"}
          theme={tableTheme}
        >
          {dataSource.length >= 20 ? <div style={{textAlign: 'center', 'lineHeight': '22px'}}>
            <Link to={`${PageURL.homePage}/spot/${path}`}>
              {toLocale('link_to_all')}
            </Link>
          </div> : null}
        </Table>
        <div className={`wait-loading ${this.state.cancelLoading ? '' : 'hide'}`} >
          <div className="loading-icon"><Icon className="icon-loadingCopy" isColor /></div>
        </div>
        {/*{this.renderPagination(pageTheme)}*/}
        {this.renderPwdDialog()}
      </div>
    );
  }
}
