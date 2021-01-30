import React from 'react';
import Pagination from '_component/Pagination';
import { getCoinIcon } from '../../utils/coinIcon';
import { toLocale } from '_src/locale/react-locale';
import WatchList from './Watchlist';
import * as api from './util/api';
import calc from '_src/utils/calc';
import util from '_src/utils/util';
import { dateFns } from '_component/okit';
import Tooltip from '../../component/Tooltip';
import SimpleBtnDialog from './SimpleBtnDialog';
import classNames from 'classnames';
import Stake from './Stake';

export default class WatchlistPanel extends React.Component {
  constructor() {
    super();
    this.columns = [
      {
        name: toLocale('Farm pool'),
        width: '200',
        component: ({ row }) => {
          return (
            <div className="coin2coin">
              {row.lock_symbol_info.symbols.map((symbol, symbolIndex) => (
                <img src={getCoinIcon(symbol)} key={symbolIndex} />
              ))}
              <Tooltip placement="right" overlay={row.pool_name}>
                <span>{row.lock_symbol_info.name}</span>
              </Tooltip>
            </div>
          );
        },
      },
      {
        field: 'total_staked',
        name: toLocale('Total staked'),
        canSort: true,
        width: '178',
        component(props) {
          return Number(props.data) === 0
            ? '--'
            : '$' + util.precisionInput(calc.mul(props.data, 1), 2);
        },
      },
      {
        field: 'pool_rate_dis',
        name: toLocale('Pool rate(1Day)'),
        width: '240',
      },
      {
        field: 'farm_apy',
        name: toLocale('Farm APY'),
        canSort: true,
        width: '142',
        component({ row }) {
          return (
            <div className="coin2coin">
              <Tooltip placement="right" overlay={row.farm_apy_dis}>
                <span>{row.total_apy}</span>
              </Tooltip>
              {row.farm_apy.map((d, index) => (
                <img src={getCoinIcon(d.denom)} key={index} />
              ))}
            </div>
          );
        },
      },
      {
        field: 'start_at',
        name: toLocale('Start at'),
        canSort: true,
        width: '194',
        component: ({ row }) => {
          if (!row.start_at) return '--';
          return dateFns.format(row.start_at_dis);
        },
      },
      {
        field: 'finish_at',
        name: toLocale('Finish at'),
        canSort: true,
        component: ({ row }) => {
          if (!row.start_at) return '--';
          if (!row.finish_at) return toLocale('finished');
          return dateFns.format(row.finish_at_dis);
        },
      },
      {
        name: toLocale('Action'),
        width: '80',
        component: ({ row }) => {
          return (
            <SimpleBtnDialog
              component={() =>
                Stake.getStake({ data: row, onSuccess: this.refreshData })
              }
            >
              <div className="action-opt-wrap">
                <div
                  className={classNames('action-opt')}
                >
                  {toLocale('Stake')}
                </div>
              </div>
            </SimpleBtnDialog>
          );
        },
      },
    ];
    this.state = {
      sort: { field: 'total_staked', sort: 'desc' },
      data: [],
      current: 1,
      pageSize: 10,
      total: 0,
    };
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
    const { data, param_page } = await api.normal(params);
    return { data, total: param_page.total };
  };

  refreshData = async () => {
    const data = await this.init({});
    this.setState(data);
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
    this.refreshData();
    this.stopTimer();
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, 3000);
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  stopTimer() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  update() {
    api.process(this.state.data);
    this.setState({});
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
