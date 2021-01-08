const Mock = require('mockjs');

const data = {
  pool_name: 'aaa-882_okt',
  lock_symbol: 'okt',
  yield_symbol: 'aaa-882',
  total_staked: '0.000000000000000000',
  start_at: parseInt(Date.now() / 1000) + 4,
  finish_at: parseInt(Date.now() / 1000) + 10,
  pool_rate: [
    {
      denom: 'aaa-882',
      amount: '288000.000000000000000000',
    },
    {
      denom: 'okt',
      amount: '0.000000000000000000',
    },
  ],
  farm_apy: [
    {
      denom: 'aaa-882',
      amount: '0.000000000000000000',
    },
    {
      denom: 'okt',
      amount: '0.000000000000000000',
    },
  ],
  pool_ratio: '0',
  total_farmed: '0',
  claimed: [],
  unclaimed: [],
  farmed_details: [
    {
      symbol: 'aaa-882',
      claimed: '0',
      unclaimed: '1.000000000000000000',
    },
  ],
  in_whitelist: false,
};
const param_page = {
  page: 1,
  per_page: 50,
  total: 100,
};
module.exports = {
  whitelist(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        'data|10': [data],
        param_page,
      },
    });
  },
  normal(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        'data|10': [data],
        param_page,
      },
    });
  },
  dashboard(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        'data|10': [data],
        param_page,
      },
    });
  },
  maxAPY(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: /\d/,
    });
  },
  stakedInfo(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        pool_name: 'aaa-882_okt',
        balance: '100.980000000000000000',
        account_staked: '10.000000000000000000',
        pool_total_staked: '10.000000000000000000',
        pool_ratio: '1.000000000000000000',
      },
    });
  },
};
