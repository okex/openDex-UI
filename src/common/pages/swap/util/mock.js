const Mock = require('mockjs');

module.exports = {
  tokens(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        native_token: 'okt',
        tokens: [
          {
            symbol: 'eos-d87',
            available: '79999990000.0000000000000000',
          },
          {
            symbol: 'okt',
            available: '8974999.9920000000000000',
          },
        ],
      },
    });
  },
  buyInfo(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        buy_amount: '19.8884651200000000',
        price: '0.9600000000',
        price_impact: '0.7800000000',
        fee: '0.0300000000okt',
        route: 'okt',
      },
    });
  },
  liquidityInfo(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      'data|10': [
        {
          base_pooled_coin: {
            denom: 'eos-c9f',
            amount: /(0\.0000000000000000)|(10\.0000000000000000)/,
          },
          quote_pooled_coin: {
            denom: 'okt',
            amount: /(0\.0000000000000000)|(10\.0000000000000000)/,
          },
          pool_token_coin: {
            denom: 'ammswap_eos-c9f_okt',
            amount: '100.0000000000000000',
          },
          pool_token_ratio: '0.04200000000',
        },
      ],
    });
  },
  addInfo(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        base_token_amount: '19.8884651200000000',
        pool_share: '0.5800000000',
      },
    });
  },
  redeemableAssets(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: [
        {
          denom: 'okt',
          amount: '20.0059940000000000',
        },
        {
          denom: 'rxb-276',
          amount: '19.9940257600000000',
        },
      ],
    });
  },
  tokenPair(url) {
    const random = Math.random(1);
    const data =
      random < 0.5
        ? null
        : {
            quote_pooled_coin: {
              denom: 'rxb-276',
              amount: '9997.0128805700000000',
            },
            base_pooled_coin: {
              denom: 'okt',
              amount: '10002.9970030000000000',
            },
            pool_token_name: 'ammswap_okt_rxb-276',
          };
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data,
    });
  },
  watchlist(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        'data|15': [
          {
            swap_pair: 'eos-d07_okt',
            liquidity: /0|2411223.0000000000000000/,
            volume24h: '23423234',
            fee_apy: '102.10000000000000000',
            last_price: '10.12300000000',
            change24h: '-0.121200000000',
          },
        ],
        param_page: {
          page: 1,
          per_page: 50,
          total: 100,
        },
      },
    });
  },
};
