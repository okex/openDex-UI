import React from 'react';
import Pagination from '_component/Pagination';
import { getCoinIcon } from './util/coinIcon';
import { toLocale } from '_src/locale/react-locale';
import WatchList from './Watchlist';
import * as api from './util/api';
import calc from '_src/utils/calc';

export default class WatchlistPanel extends React.Component {
  constructor() {
    super();
    this.columns = [
      {
        field: 'swap_pair',
        name: toLocale('Farm pool'),
        width: '269',
        component: ({ row, data }) => {
          const tokens = data.split('_');
          if (row.isRevert) tokens.reverse();
          let baseSymbol = tokens[0];
          let targetSymbol = tokens[1];
          return (
            <div className="coin2coin">
              <img src={getCoinIcon(baseSymbol)} />
              <img src={getCoinIcon(targetSymbol)} />
              <span>
                {baseSymbol.toUpperCase()}/{targetSymbol.toUpperCase()}
              </span>
            </div>
          );
        },
      },
      {
        field: 'liquidity',
        name: toLocale('Total staked'),
        canSort: true,
        width: '154',
        component(props) {
          return Number(props.data) === 0
            ? '--'
            : '$' + calc.mul(props.data, 1).toFixed(2);
        },
      },
      {
        field: 'volume24h',
        name: toLocale('Pool rate(1Day)'),
        width: '154',
        component(props) {
          return Number(props.data) === 0
            ? '--'
            : '$' + calc.mul(props.data, 1).toFixed(2);
        },
      },
      {
        field: 'fee_apy',
        name: toLocale('Farm APY'),
        canSort: true,
        width: '122',
        component(props) {
          return Number(props.data) === 0
            ? '--'
            : calc.mul(props.data, 100).toFixed(2) + '%';
        },
      },
      {
        field: 'last_price',
        name: toLocale('Start at'),
        canSort: true,
        width: '194',
        component({ row, data }) {
          const tokens = row.swap_pair.split('_');
          let price = data;
          if (row.isRevert) {
            tokens.reverse();
            price = calc.div(1, data);
          }
          let baseSymbol = tokens[0];
          let targetSymbol = tokens[1];
          return (
            <div style={{ paddingRight: '5px' }}>
              1 {baseSymbol.toUpperCase()}≈
              {Number(price) === 0 || Number(price) === Infinity
                ? '-'
                : calc.mul(price, 1).toFixed(4)}{' '}
              {targetSymbol.toUpperCase()}
            </div>
          );
        },
      },
      {
        field: 'change24h',
        name: toLocale('Finish at'),
        canSort: true,
        width: '128',
        component({ row, data }) {
          let change = calc.add(data, 0);
          if (row.isRevert) change = calc.div(1, calc.add(data, 1)) - 1;
          if (change > 0)
            return (
              <span className="green">
                {calc.mul(change, 100).toFixed(2) + '%'}
              </span>
            );
          else if (change < 0)
            return (
              <span className="red">
                {calc.mul(change, 100).toFixed(2) + '%'}
              </span>
            );
          return calc.mul(change, 100).toFixed(2) + '%';
        },
      },
      {
        name: toLocale('Action'),
        component: ({ row }) => {
          return (
            <div className="action-opt-wrap">
              <div className="action-opt" onClick={() => this.goTrade(row)}>
                {toLocale('Stake')}
              </div>
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
    const params = {
      base_token: tokens[0],
      quote_token: tokens[1],
    };
    let liquidity, liquidityInfo, userLiquidity;
    try {
      liquidity = await api.tokenPair(params);
      liquidityInfo = await api.liquidityInfo(params);
      userLiquidity = liquidityInfo && liquidityInfo[0];
    } catch (e) {
      console.log(e);
    }
    this.props.onAddLiquidity({
      component: AddLiquidity,
      props: {
        liquidity,
        userLiquidity,
        disabledChangeCoin: false,
      },
    });
  }

  goTrade(row) {
    const tokens = row.swap_pair.split('_');
    if (row.isRevert) tokens.reverse();
    let baseSymbol = tokens[0];
    let targetSymbol = tokens[1];
    this.props.onTrade({ baseSymbol, targetSymbol });
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

  async componentDidMount() {
    const data = await this.init({ current: this.state.current });
    this.setState(data);
  }

  async reload() {
    const data = await this.init({ current: 1 });
    this.setState({ ...data, current: 1 });
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
        {total > pageSize && (
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
