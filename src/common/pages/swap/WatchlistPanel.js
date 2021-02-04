import React from 'react';
import { withRouter } from 'react-router-dom';
import Pagination from '_component/Pagination';
import PageURL from '_constants/PageURL';
import { getCoinIcon, getDisplaySymbol } from '../../utils/coinIcon';
import { toLocale } from '_src/locale/react-locale';
import WatchList from './Watchlist';
import * as api from './util/api';
import calc from '_src/utils/calc';
import Tooltip from '../../component/Tooltip';
import util from '_src/utils/util';
@withRouter
export default class WatchlistPanel extends React.Component {
  constructor() {
    super();
    this.columns = [
      {
        field: 'swap_pair',
        name: toLocale('Swap Pair'),
        width: '259',
        component: ({ row, data }) => {
          const tokens = data.split('_');
          if (row.isRevert) tokens.reverse();
          let baseSymbol = tokens[0];
          let targetSymbol = tokens[1];
          return (
            <div className="coin2coin">
              <span className="exchange" onClick={() => this.exchange(row)} />
              <img src={getCoinIcon(baseSymbol)} />
              <img src={getCoinIcon(targetSymbol)} />
              <span>
                {getDisplaySymbol(baseSymbol)}/{getDisplaySymbol(targetSymbol)}
              </span>
            </div>
          );
        },
      },
      {
        field: 'liquidity',
        name: toLocale('Liquidity'),
        canSort: true,
        width: '154',
        component(props) {
          return Number(props.data) === 0
            ? '--'
            : '$' + util.precisionInput(props.data,2);
        },
      },
      {
        field: 'volume24h',
        name: toLocale('24H Volume'),
        canSort: true,
        width: '154',
        component(props) {
          return Number(props.data) === 0
            ? '--'
            : '$' + util.precisionInput(props.data,2);
        },
      },
      {
        field: 'fee_apy',
        name() {
          return (
            <React.Fragment>
              <Tooltip
                placement="right"
                overlay={toLocale('based on 24hr volume annualized')}
              >
                <i className="help" />
              </Tooltip>
              {toLocale('Fee APY')}
            </React.Fragment>
          );
        },
        canSort: true,
        width: '122',
        component(props) {
          return Number(props.data) === 0
            ? '--'
            : util.precisionInput(calc.mul(props.data, 100),2) + '%';
        },
      },
      {
        field: 'last_price',
        name: toLocale('Last Price'),
        canSort: true,
        width: '222',
        component({ row, data }) {
          const tokens = row.swap_pair.split('_');
          let price = data;
          if (!row.isRevert) {
            price = calc.div(1, data);
          } else {
            tokens.reverse();
          }
          let baseSymbol = tokens[0];
          let targetSymbol = tokens[1];
          return (
            <div>
              1 {getDisplaySymbol(baseSymbol)}≈
              {Number(price) === 0 || Number(price) === Infinity
                ? '-'
                : util.precisionInput(price, 4)}{' '}
              {getDisplaySymbol(targetSymbol)}
            </div>
          );
        },
      },
      {
        field: 'change24h',
        name: toLocale('24H Change'),
        canSort: true,
        width: '110',
        component({ row, data }) {
          let change = calc.add(data, 0);
          if (!row.isRevert) change = calc.div(1, calc.add(data, 1)) - 1;
          if (!Number.isFinite(change)) return '--';
          if (change > 0)
            return (
              <span className="green">
                {util.precisionInput(calc.mul(change, 100),2) + '%'}
              </span>
            );
          else if (change < 0)
            return (
              <span className="red">
                {util.precisionInput(calc.mul(change, 100),2) + '%'}
              </span>
            );
          return util.precisionInput(calc.mul(change, 100),2) + '%';
        },
      },
      {
        name: '',
        component: ({ row }) => {
          let price = row.last_price;
          return (
            <div className="action-opt-wrap">
              <div
                className="action-opt"
                onClick={() => this.addLiquidity(row)}
              >
                + {toLocale('Add Liquidity')}
              </div>
              <div className="action-sep"></div>
              {Number(price) === 0 || Number(price) === Infinity ? (
                <div className="action-opt disabled">{toLocale('Trade')}</div>
              ) : (
                <div className="action-opt" onClick={() => this.goTrade(row)}>
                  {toLocale('Trade')}
                </div>
              )}
            </div>
          );
        },
      },
    ];
    this.state = {
      sort: { field: 'liquidity', sort: 'desc' },
      data: [],
      current: 1,
      pageSize: 15,
      total: 0,
    };
  }

  exchange(row) {
    row.isRevert = !row.isRevert;
    this.setState({});
  }

  async addLiquidity(row) {
    const tokens = row.swap_pair.split('_');
    this.props.history.push(`${PageURL.addLiquidityPage}/${tokens[0]}/${tokens[1]}`);
  }

  goTrade(row) {
    const tokens = row.swap_pair.split('_');
    if (row.isRevert) tokens.reverse();
    let baseSymbol = tokens[0];
    let targetSymbol = tokens[1];
    this.props.history.push(`${PageURL.swapPage}/${baseSymbol}/${targetSymbol}`);
  }

  init = async ({ current, sort }) => {
    const { pageSize } = this.state;
    if (!current) current = this.state.current;
    if (!sort) sort = this.state.sort;
    let params = { page: current, per_page: pageSize };
    if (sort) {
      params.sort_column = sort.field;
      params.sort_direction = sort.sort;
    }
    const { data, param_page } = await api.watchlist(params);
    return { data, total: param_page.total };
  };

  onChange = async (current) => {
    const data = await this.init({ current });
    this.setState({ ...data, current });
  };

  onSort = async (sort) => {
    const data = await this.init({ sort });
    this.setState({ ...data, sort });
  };
  
  componentWillUnmount() {
    this._clearTimer();
  }

  async componentDidMount() {
    const data = await this.init({ current: this.state.current });
    this.setState(data);
    this.updateWatchList4RealTime();
  }

  _clearTimer() {
    if (this.updateWatchList4RealTime.interval) {
      clearInterval(this.updateWatchList4RealTime.interval);
      this.updateWatchList4RealTime.interval = null;
    }
  }

  updateWatchList4RealTime = async (time = 3000) => {
    this._clearTimer();
    this.updateWatchList4RealTime.interval = setInterval(async () => {
      const data = await this.init({});
      this.setState(data);
    }, time);
  }
  
  render() {
    const { sort, data, current, pageSize, total } = this.state;
    return (
      <div className="panel-watchlist">
        <WatchList
          sort={sort}
          data={data}
          columns={this.columns}
          onSort={this.onSort}
        >
          {!total && (
            <div className="nodata">{toLocale('watchlist noData')}</div>
          )}
        </WatchList>
        {!!total && (
          <div className="pagination-wrap">
            <Pagination
              className="watchlist-pagination"
              total={total}
              pageSize={pageSize}
              current={current}
              onChange={this.onChange}
              hideOnSinglePage={false}
            />
          </div>
        )}
      </div>
    );
  }
}
