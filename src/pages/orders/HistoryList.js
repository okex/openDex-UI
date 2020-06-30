import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DatePicker from '_component/ReactDatepicker';
import Select from '_component/ReactSelect';
import 'react-datepicker/dist/react-datepicker.css';
import { toLocale } from '_src/locale/react-locale';
import Message from '_src/component/Message';
import Checkbox from 'rc-checkbox';
import moment from 'moment';
import Cookies from 'js-cookie';
import RouterCredential from '../../RouterCredential';
import ont from '../../utils/dataProxy';
import DexTable from '../../component/DexTable';
import URL from '../../constants/URL';
import * as SpotActions from '../../redux/actions/SpotAction';
import * as OrderActions from '../../redux/actions/OrderAction';
import Enum from '../../utils/Enum';
import orderUtil from './orderUtil';

import './OrderList.less';
import {Button} from "_component/Button";
import normalColumns from "../spotOrders/normalColumns";
import commonUtil from "../spotOrders/commonUtil";
import util from "../../utils/util";

function mapStateToProps(state) { // 绑定redux中相关state'
  const { product, productList, productObj } = state.SpotTrade;
  const { data } = state.OrderStore;
  const { theme } = state.Spot;
  return {
    product, productList, productObj, data, theme
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
    orderActions: bindActionCreators(OrderActions, dispatch)
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
export default class HistoryList extends RouterCredential {
  constructor(props, context) {
    super(props, context);
    this.threeDaysAgo = moment().subtract(3, 'days').endOf('day');
    this.todayAgo = moment().subtract(0, 'days').endOf('day');
    this.minDate = moment().subtract(3, 'month');
    this.maxDate = moment();
    this.state = {
      product: 'all',
      side: 'all',
      start: this.threeDaysAgo,
      end: this.todayAgo,
      hiddenCancel: 0, // 默认查询已撤销的订单，为真不查询已撤销订单
    };
  }
  componentWillMount() {
    const { orderActions } = this.props;
    orderActions.resetData();
    if (this.props.location.state && this.props.location.state.product) {
      this.setState({
        product: this.props.location.state.product
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
        end
      });
    }
  }
  componentDidMount() {
    const { spotActions } = this.props;
    spotActions.fetchProducts();
    const { webType } = window.OK_GLOBAL;
    document.title = toLocale('spot.orders.orderHistory') + toLocale('spot.page.title');
    this.onSearch();
  }
  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
    const { orderActions } = this.props;
    orderActions.resetData();
  }
  // 查询
  onBtnSearch = () => {
    this.onSearch({ page: 1 });
  };
  onSearch = (param) => {
    const { orderActions } = this.props;
    const { start, end } = this.state;
    const params = {
      ...this.state,
      ...param
    };
    params.start = Math.floor(start.valueOf() / 1000) - 86400;
    params.end = Math.floor(end.valueOf() / 1000);
    if (params.start >= params.end) {
      Message.warn({ content: toLocale('spot.orders.tips.dateRange') });
      return false;
    }
    params.from = 'IndependentPage';
    // TODO 第二期加上
    delete params.hiddenCancel;

    orderActions.getHistoryList(params);
  };
  // 币对改变
  onProductsChange = (obj) => {
    const value = obj.value;
    if (value.length > 0) {
      this.setState({
        product: value
      }, () => {
        this.onSearch({ page: 1 });
      });
    }
  };
  // 买卖筛选的改版
  onSideChange = (obj) => {
    const value = obj.value;
    let side = 'all';
    if (+value === 1) {
      side = 'BUY';
    } else if (+value === 2){
      side = 'SELL';
    }
    this.setState({
      side: side
    }, () => {
      this.onSearch({ page: 1 });
    });
  };
  // 设置日期
  onDatePickerChange(key) {
    return (date) => {
      this.setState({
        [key]: date
      }, () => {
        this.onSearch({ page: 1 });
      });
    };
  }
  // 页码变化
  onPageChange = (page) => {
    this.onSearch({page});
  };
  // 隐藏已撤销订单
  updateHideOrders = (e) => {
    this.setState({
      hiddenCancel: e.target.checked ? 1 : 0
    }, () => {
      this.onSearch({ page: 1 });
    });
  };
  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  // 渲染查询条件行
  renderQuery = () => {
    const { productList } = this.props;
    const sortProductList = productList.sort((a, b) => { return (a.base_asset_symbol).localeCompare(b.base_asset_symbol); });
    const newProductList = sortProductList.map((obj) => {
      return {
        value: obj.product,
        label: obj.product.replace('_', '/').toUpperCase()
      };
    });
    const {
      product, side, start, end, hiddenCancel
    } = this.state;
    newProductList.unshift({ value: 'all', label: toLocale('spot.orders.allProduct') });
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
            value={side === 'all' ? 0 : (side === 'BUY' ? 1 : 2)}
            onChange={this.onSideChange}
            options={orderUtil.sideList()}
            className="select-theme-controls mar-rig16 select-container"
            style={{ width: 160 }}
          />
          <span></span>
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
            locale={util.getSupportLocale(Cookies.get('locale') || 'en_US').toLocaleLowerCase()}
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
            locale={util.getSupportLocale(Cookies.get('locale') || 'en_US').toLocaleLowerCase()}
            onChange={this.onDatePickerChange('end')}
          />
          <Button size={Button.size.small} type={Button.btnType.primary} onClick={this.onBtnSearch}>{toLocale('spot.search')}</Button>

          <div className="hide-cancel">
            <div>
              <label className="btn-group">
                <Checkbox
                  onChange={this.updateHideOrders}
                  className="content-box"
                  checked={hiddenCancel === 1}
                />
                <span className="check-text">{toLocale('spot.orders.historyRescinded')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { theme, productObj, data } = this.props;
    const { orderList, isLoading, page } = data;
    let newList = orderList;
    if (orderList.length && orderList[0].uniqueKey) {
      newList = [];
    }
    const themeColor = (theme === Enum.themes.theme2) ? 'dark' : '';
    return (
      <div className="spot-orders flex10">
        <div className='title'>{toLocale('spot.orders.orderHistory')}</div>
        {this.renderQuery()}
        <DexTable
          columns={normalColumns.historyColumns()}
          dataSource={commonUtil.formatClosedData(newList, productObj)}
          empty={orderUtil.getEmptyContent()}
          rowKey="order_id"
          style={{ clear: 'both', zIndex: 0 }}
          isLoading={isLoading}
          theme={themeColor}
          pagination={page}
          onPageChange={this.onPageChange}
        />
        <p className="spot-orders-utips c-disabled" style={{ display: 'none'}}>
          {toLocale('spot.bills.clearTips')}
        </p>
      </div>
    );
  }
}
