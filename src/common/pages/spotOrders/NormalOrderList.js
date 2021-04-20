import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import { Dialog } from '_component/Dialog';
import Icon from '_src/component/IconLite';
import PageURL from '_constants/PageURL';
import Table from '../../component/ok-table';
import commonUtil from './commonUtil';
import normalColumns from './normalColumns';
import Enum from '../../utils/Enum';
import * as OrderAction from '../../redux/actions/OrderAction';
import * as SpotAction from '../../redux/actions/SpotAction';
import * as CommonAction from '../../redux/actions/CommonAction';
import PasswordDialog from '../../component/PasswordDialog';
import Message from '_src/component/Message';
import * as FormAction from '../../redux/actions/FormAction';
import Config from '../../constants/Config';
import { Link } from 'react-router-dom';
import util from '../../utils/util';

function mapStateToProps(state) {
  const { theme, wsIsOnline } = state.Spot;
  const { productObj, product } = state.SpotTrade;
  const {
    type,
    entrustType,
    data,
    isHideOthers,
    periodIntervalType,
  } = state.OrderStore;
  const { privateKey } = state.Common;
  const { FormStore } = state;
  return {
    theme,
    wsIsOnline,
    productObj,
    product,
    type,
    entrustType,
    data,
    privateKey,
    FormStore,
    isHideOthers,
    periodIntervalType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    orderAction: bindActionCreators(OrderAction, dispatch),
    formAction: bindActionCreators(FormAction, dispatch),
    spotAction: bindActionCreators(SpotAction, dispatch),
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class NormalOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowPwdDialog: false,
      cancelLoading: false,
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
      end,
    };
  }

  onCancelOrder = (order) => {
    return (e) => {
      e.persist();
      if (!util.isLogined()) {
        window.location.reload();
      }

      const order_id = order.order_id;
      let title = toLocale('spot.myOrder.cancelPartDealTip');
      if (order.quantity - order.remain_quantity === 0) {
        title = toLocale('spot.myOrder.cancelNoDealTip');
      }
      const dialog = Dialog.confirm({
        title: title,
        confirmText: toLocale('ensure'),
        cancelText: toLocale('cancel'),
        theme: 'dark',
        dialogId: 'okdex-confirm',
        windowStyle: {
          background: '#112F62',
        },
        onConfirm: () => {
          dialog.destroy();
          if (Number(e.target.getAttribute('canceling'))) {
            return;
          }
          e.target.setAttribute('canceling', 1);
          this.targetNode = e.target;
          this.formParam = { order_id };
          if (this.props.isHideOthers && this.props.product) {
            this.formParam = { ...this.formParam, product: this.props.product };
          }
          const expiredTime = window.localStorage.getItem('pExpiredTime') || 0;
          if (
            util.isWalletConnect() ||
            (new Date().getTime() < +expiredTime && this.props.privateKey)
          ) {
            const param = { ...this.formParam, pk: this.props.privateKey };
            this.setState(
              {
                isShowPwdDialog: false,
                cancelLoading: true,
              },
              () => {
                e.target.setAttribute('canceling', 0);
                this.props.orderAction.cancelOrder(
                  param,
                  this.successToast,
                  this.onSubmitErr
                );
              }
            );
          } else {
            e.target.setAttribute('canceling', 0);
            this.onPwdOpen();
          }
        },
      });
    };
  };
  onPageChange = (page) => {
    this.props.orderAction.getOrderList({ page });
  };

  renderPagination = (theme) => {
    const { entrustType, type, data } = this.props;
    const { page } = data;
    return commonUtil.renderPagination(page, type, this.onPageChange, theme);
  };
  successToast = () => {
    this.successCallback && this.successCallback();
    this.setState({ cancelLoading: false });
    Message.success({
      content: toLocale('spot.myOrder.cancelSuccessed'),
      duration: 3,
    });
  };
  onSubmitErr = (err) => {
    this.onPwdClose();
    this.targetNode.removeAttribute('canceling');
    this.errorCallback && this.errorCallback(err);
    this.setState({ cancelLoading: false });
    Message.error({
      content: err.msg || toLocale('spot.myOrder.cancelFailed'),
      duration: 3,
    });
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
        isLoading: false,
        isShowPwdDialog: false,
      },
      () => {
        this.errorCallback && this.errorCallback();
      }
    );
  };
  onPwdEnter = (password) => {
    const { formAction, orderAction, commonAction } = this.props;
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
              this.setState(
                {
                  isShowPwdDialog: false,
                  cancelLoading: true,
                },
                () => {
                  orderAction.cancelOrder(
                    param,
                    () => {
                      this.successToast();
                      this.onPwdClose();
                    },
                    this.onSubmitErr
                  );
                }
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
    const {
      data,
      theme,
      type,
      product,
      productObj,
      isHideOthers,
      spotAction,
    } = this.props;
    const { isLoading, orderList, page } = data;
    const { total } = page;
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
      columns = normalColumns.noDealColumns(
        this.onCancelOrder,
        spotAction.updateProduct
      );
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
    return (
      <div>
        <Table
          columns={columns}
          isLoading={isLoading}
          dataSource={dataSource}
          empty={commonUtil.getEmpty()}
          rowKey={type === Enum.order.type.detail ? 'uniqueKey' : 'order_id'}
          theme={tableTheme}
        >
          {dataSource.length >= 20 ? (
            <div style={{ textAlign: 'center', lineHeight: '22px' }}>
              <Link to={`${PageURL.homePage}/spot/${path}`}>
                {toLocale('link_to_all')}
              </Link>
            </div>
          ) : null}
        </Table>
        <div
          className={`wait-loading ${this.state.cancelLoading ? '' : 'hide'}`}
        >
          <div className="loading-icon">
            <Icon className="icon-loadingCopy" isColor />
          </div>
        </div>
        {this.renderPwdDialog()}
      </div>
    );
  }
}
