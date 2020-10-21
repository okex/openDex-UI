import React from 'react';
import Pagination from '_component/Pagination';
import { getCoinIcon } from './util/coinIcon';
import { toLocale } from '_src/locale/react-locale';
import WatchList from './Watchlist';
import * as api from './util/api';
import calc from '_src/utils/calc';
import { withRouter } from 'react-router-dom';
import PageURL from '_src/constants/PageURL';
import AddLiquidity from './AddLiquidity';
@withRouter
export default class WatchlistPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      sort: null,
      data: [],
      current: 1,
      pageSize: 10,
      total: 0,
    };
    this.columns = [
      {
        field: 'swap_pair',
        name: toLocale('Swap Pair'),
        width: '269',
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
                {baseSymbol}/{targetSymbol}
              </span>
            </div>
          );
        },
      },
      {
        field: 'liquidity',
        name: toLocale('Liquidity'),
        canSort: true,
        width: '164',
        component(props) {
          return props.data;
        },
      },
      {
        field: 'volume24h',
        name: toLocale('24H Volume'),
        canSort: true,
        width: '164',
        component(props) {
          return props.data;
        },
      },
      {
        field: 'fee_apy',
        name: toLocale('Fee APY'),
        canSort: true,
        width: '102',
        component(props) {
          return props.data;
        },
      },
      {
        field: 'last_price',
        name: toLocale('Last Price'),
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
          return `1 ${baseSymbol}≈${price} ${targetSymbol}`;
        },
      },
      {
        field: 'change24h',
        name: toLocale('24H Change'),
        canSort: true,
        width: '128',
        component({ row, data }) {
          let change = calc.add(data, 0);
          if (row.isRevert) change = calc.div(1, calc.add(data, 1)) - 1;
          if (change > 0) return <span className="green">{change}</span>;
          else if (change < 0) return <span className="red">{change}</span>;
          return change;
        },
      },
      {
        name: toLocale('Action'),
        component: ({ row }) => {
          return (
            <div className="action-opt-wrap">
              <div
                className="action-opt"
                onClick={() => this.addLiquidity(row)}
              >
                + {toLocale('Add Liquidity')}
              </div>
              <div className="action-sep"></div>
              <div className="action-opt" onClick={() => this.goTrade(row)}>
                {toLocale('Trade')}
              </div>
            </div>
          );
        },
      },
    ];
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
    const liquidity = await api.tokenPair(params);
    const liquidityInfo = await api.liquidityInfo(params);
    const userLiquidity = liquidityInfo && liquidityInfo[0];
    this.props.push({
      component: AddLiquidity,
      props: {
        liquidity,
        userLiquidity,
        disabledChangeCoin: false,
      },
    });
  }

  goTrade(row) {
    const url = `${
      PageURL.spotFullPage
    }#product=${row.swap_pair.toLowerCase()}`;
    this.props.history.replace(url);
  }

  init = async ({ current, sort }) => {
    const { pageSize } = this.state;
    if (!current) current = this.state.current;
    if (!sort) sort = this.state.sort;
    const params = { page: current, per_page: pageSize };
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

  render() {
    const { sort, data, current, pageSize, total } = this.state;
    if (!total) return null;
    return (
      <div className="panel-watchlist">
        <WatchList
          sort={sort}
          data={data}
          columns={this.columns}
          onSort={this.onSort}
        />
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
      </div>
    );
  }
}
