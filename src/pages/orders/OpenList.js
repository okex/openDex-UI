import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DatePicker from '_component/ReactDatepicker';
import Select from '_component/ReactSelect';
import 'react-datepicker/dist/react-datepicker.css';
import { toLocale } from '_src/locale/react-locale';
import Message from '_src/component/Message';
import { Dialog } from '_component/Dialog';
import Icon from '_src/component/IconLite';
import moment from 'moment';
import Cookies from 'js-cookie';
import RouterCredential from '../../RouterCredential';
import DexTable from '../../component/DexTable';
import * as SpotActions from '../../redux/actions/SpotAction';
import * as OrderActions from '../../redux/actions/OrderAction';
import Enum from '../../utils/Enum';
import orderUtil from './orderUtil';
import PasswordDialog from '../../component/PasswordDialog';
import './OrderList.less';
import { Button } from '_component/Button';
import normalColumns from '../spotOrders/normalColumns';
import commonUtil from '../spotOrders/commonUtil';
import * as CommonAction from '../../redux/actions/CommonAction';
import * as FormAction from '../../redux/actions/FormAction';
import Config from '../../constants/Config';
import util from '../../utils/util';

function mapStateToProps(state) {
  const { product, productList, productObj } = state.SpotTrade;
  const { data } = state.OrderStore;
  const { theme } = state.Spot;
  const { privateKey } = state.Common;
  const { FormStore } = state;
  return {
    product,
    productList,
    productObj,
    data,
    theme,
    privateKey,
    FormStore,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
    formActions: bindActionCreators(FormAction, dispatch),
    spotActions: bindActionCreators(SpotActions, dispatch),
    orderActions: bindActionCreators(OrderActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class OpenList extends RouterCredential {
  constructor(props, context) {
    super(props, context);
    this.threeDaysAgo = moment().subtract(3, 'days').endOf('day');
    this.todayAgo = moment().subtract(0, 'days').endOf('day');
    this.minDate = moment().subtract(3, 'month');
    this.maxDate = moment();
    this.state = {
      isLoading: false,
      isShowPwdDialog: false,
      cancelLoading: false,
      product: 'all',
      side: 'all',
      start: this.threeDaysAgo,
      end: this.todayAgo,
    };
    this.targetNode = null;
  }
  componentWillMount() {
    const { orderActions } = this.props;
    orderActions.resetData();
    if (this.props.location.state && this.props.location.state.product) {
      this.setState({
        product: this.props.location.state.product,
      });
    }
    if (this.props.location.state && this.props.location.state.period) {
      let interval = 1;
      const period = this.props.location.state.period;
      if (period === 'oneWeek') {
        interval = 7;
      } else if (period === 'oneMonth') {
        interval = 30;
      } else if (period === 'threeMonth') {
        interval = 90;
      }
      const start = moment().subtract(interval, 'days').endOf('day');
      const end = moment().subtract(0, 'days').endOf('day');
      this.setState({
        start,
        end,
      });
    }
  }
  componentDidMount() {
    this.props.commonAction.initOKChainClient();
    const { spotActions, orderActions } = this.props;
    spotActions.fetchProducts();
    const { webType } = window.OK_GLOBAL;
    document.title =
      toLocale('spot.orders.openOrders') + toLocale('spot.page.title');
    this.onSearch();
  }
  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {
    const { orderActions } = this.props;
    orderActions.resetData();
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
      const _this = this;
      const dialog = Dialog.confirm({
        title,
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
          this.formParam = {
            order_id,
            start: Math.floor(_this.state.start.valueOf() / 1000 - 86400),
            end: Math.floor(_this.state.end.valueOf() / 1000),
          };
          if (_this.state.product !== 'all') {
            this.formParam = {
              ...this.formParam,
              product: _this.state.product,
            };
          }
          if (_this.state.side !== 'all') {
            this.formParam = { ...this.formParam, side: _this.state.side };
          }
          const expiredTime = window.localStorage.getItem('pExpiredTime') || 0;
          if (new Date().getTime() < +expiredTime && this.props.privateKey) {
            const param = { ...this.formParam, pk: this.props.privateKey };
            this.setState(
              {
                isShowPwdDialog: false,
                cancelLoading: true,
              },
              () => {
                e.target.setAttribute('canceling', 0);
                this.props.orderActions.cancelOrder(
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

  onBtnSearch = () => {
    this.onSearch({ page: 1 });
  };
  onSearch = (param) => {
    const { orderActions } = this.props;
    const { start, end } = this.state;
    const params = {
      product: this.state.product,
      start: this.state.start,
      end: this.state.end,
      side: this.state.side,
      ...param,
    };
    params.start = Math.floor(start.valueOf() / 1000) - 86400;
    params.end = Math.floor(end.valueOf() / 1000);
    if (params.start >= params.end) {
      Message.warn({ content: toLocale('spot.orders.tips.dateRange') });
      return false;
    }
    params.from = 'IndependentPage';
    orderActions.getNoDealList(params);
  };

  onProductsChange = (obj) => {
    const value = obj.value;
    if (value.length > 0) {
      this.setState(
        {
          product: value,
        },
        () => {
          this.onSearch({ page: 1 });
        }
      );
    }
  };

  onSideChange = (obj) => {
    const value = obj.value;
    let side = 'all';
    if (+value === 1) {
      side = 'BUY';
    } else if (+value === 2) {
      side = 'SELL';
    }
    this.setState(
      {
        side,
      },
      () => {
        this.onSearch({ page: 1 });
      }
    );
  };

  onDatePickerChange(key) {
    return (date) => {
      this.setState(
        {
          [key]: date,
        },
        () => {
          this.onSearch({ page: 1 });
        }
      );
    };
  }

  onPageChange = (page) => {
    this.onSearch({ page });
  };
  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  renderQuery = () => {
    const { productList } = this.props;
    const sortProductList = productList.sort((a, b) => {
      return a.base_asset_symbol.localeCompare(b.base_asset_symbol);
    });
    const newProductList = sortProductList.map((obj) => {
      return {
        value: obj.product,
        label: obj.product.replace('_', '/').toUpperCase(),
      };
    });
    const { product, side, start, end } = this.state;
    newProductList.unshift({
      value: 'all',
      label: toLocale('spot.orders.allProduct'),
    });
    return (
      <div className="query-container">
        <div className="sub-query">
          <span>{toLocale('spot.orders.symbol')}</span>
          <Select
            clearable={false}
            searchable={false}
            small
            theme="dark"
            name="form-field-name"
            value={product}
            onChange={this.onProductsChange}
            options={newProductList}
            style={{ width: 160 }}
          />
          <span>{toLocale('spot.myOrder.direction')}</span>
          <Select
            clearable={false}
            searchable={false}
            small
            theme="dark"
            name="form-field-name"
            value={side === 'all' ? 0 : side === 'BUY' ? 1 : 2}
            onChange={this.onSideChange}
            options={orderUtil.sideList()}
            className="select-theme-controls mar-rig16 select-container"
            style={{ width: 160 }}
          />
          <span />
          <DatePicker
            small
            selectsStart
            theme="dark"
            placeholderText="起始时间"
            selected={start || null}
            startDate={start || null}
            endDate={end || null}
            dateFormat="YYYY-MM-DD"
            onChangeRaw={this.handleDateChangeRaw}
            minDate={this.minDate}
            maxDate={end || this.maxDate}
            locale={util
              .getSupportLocale(Cookies.get('locale') || 'en_US')
              .toLocaleLowerCase()}
            onChange={this.onDatePickerChange('start')}
          />
          <div className="dash" />
          <DatePicker
            small
            selectsEnd
            theme="dark"
            placeholderText="截止时间"
            selected={end || null}
            startDate={start || null}
            endDate={end || null}
            dateFormat="YYYY-MM-DD"
            onChangeRaw={this.handleDateChangeRaw}
            minDate={start || this.minDate}
            maxDate={this.maxDate}
            locale={util
              .getSupportLocale(Cookies.get('locale') || 'en_US')
              .toLocaleLowerCase()}
            onChange={this.onDatePickerChange('end')}
          />
          <Button
            className="btn"
            size={Button.size.small}
            type={Button.btnType.primary}
            onClick={this.onBtnSearch}
          >
            {toLocale('spot.search')}
          </Button>
        </div>
      </div>
    );
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
      content: toLocale('spot.myOrder.cancelFailed'),
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
    const { formActions, orderActions, commonAction } = this.props;
    if (password.trim() === '') {
      return formActions.updateWarning(toLocale('spot.place.tips.pwd'));
    }
    formActions.updateWarning('');
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
                  orderActions.cancelOrder(
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
        isShow={isShowPwdDialog}
        updateWarning={this.props.formActions.updateWarning}
        onEnter={this.onPwdEnter}
        onClose={this.onPwdClose}
      />
    );
  };
  render() {
    const { theme, productObj, data } = this.props;
    const { orderList, isLoading, page } = data;
    const themeColor = theme === Enum.themes.theme2 ? 'dark' : '';
    let newList = orderList;
    if (orderList.length && orderList[0].uniqueKey) {
      newList = [];
    }
    return (
      <div className="spot-orders flex10">
        <div className="title">{toLocale('spot.orders.openOrders')}</div>
        {this.renderQuery()}
        <DexTable
          columns={normalColumns.noDealColumns(this.onCancelOrder)}
          dataSource={commonUtil.formatOpenData(newList, productObj)}
          empty={orderUtil.getEmptyContent()}
          rowKey="order_id"
          style={{ clear: 'both', zIndex: 0 }}
          isLoading={isLoading}
          theme={themeColor}
          pagination={page}
          onPageChange={this.onPageChange}
        />
        <p className="spot-orders-utips c-disabled" style={{ display: 'none' }}>
          {toLocale('spot.bills.clearTips')}
        </p>
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

export default OpenList;
