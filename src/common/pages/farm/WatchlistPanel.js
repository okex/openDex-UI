import React from 'react';
import Pagination from '_component/Pagination';
import { getCoinIcon } from './util/coinIcon';
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
        width: '269',
        component: ({ row }) => {
          return (
            <div className="coin2coin">
              <img src={getCoinIcon(row.lock_symbol)} />
              <img src={getCoinIcon(row.yield_symbol)} />
              <span>
                {row.lock_symbol_dis}/{row.yield_symbol_dis}
              </span>
            </div>
          );
        },
      },
      {
        field: 'total_staked',
        name: toLocale('Total staked'),
        canSort: true,
        width: '154',
        component(props) {
          return Number(props.data) === 0
            ? '--'
            : '$' + util.precisionInput(calc.mul(props.data, 1), 2);
        },
      },
      {
        field: 'pool_rate_dis',
        name: toLocale('Pool rate(1Day)'),
        width: '154',
      },
      {
        field: 'total_apy',
        name: toLocale('Farm APY'),
        canSort: true,
        width: '122',
        component({ row, data }) {
          return (
            <div className="coin2coin">
              <Tooltip placement="right" overlay={row.farm_apy_dis}>
                <span>{data}</span>
              </Tooltip>
              <img src={getCoinIcon(row.lock_symbol)} />
              <img src={getCoinIcon(row.yield_symbol)} />
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
          return dateFns.format(row.start_at_dis);
        },
      },
      {
        field: 'finish_at',
        name: toLocale('Finish at'),
        canSort: true,
        component: ({ row }) => {
          return dateFns.format(row.finish_at_dis);
        },
      },
      {
        name: toLocale('Action'),
        width: '128',
        component: ({ row }) => {
          return (
            <SimpleBtnDialog component={() => Stake.getStake(row)} disabled={!row.active}>
              <div className="action-opt-wrap">
                <div
                  className={classNames('action-opt', {
                    disabled: !row.active,
                  })}
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
      pageSize: 1,
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