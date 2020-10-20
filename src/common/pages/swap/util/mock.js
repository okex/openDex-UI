const Mock = require('mockjs');

module.exports = {
  tokens(url) {
    Mock.mock(url, {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        native_token: 'okt',
        tokens: [
          {
            symbol: 'eos-d87',
            available: '79999990000.00000000',
          },
          {
            symbol: 'okt',
            available: '8974999.99200000',
          },
        ],
      },
    });
  },
  buyInfo(url) {
    Mock.mock(url, {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        buy_amount: '19.88846512',
        price: '0.96',
        price_impact: '0.78',
        fee: '0.03okt',
        route: 'okt',
      },
    });
  },
  liquidityInfo(url) {
    Mock.mock(url, {
      code: 0,
      msg: '',
      detail_msg: '',
      'data|10': [
        {
          base_pooled_coin: {
            denom: 'eos-c9f',
            amount: /(0\.00000000)|(10\.00000000)/,
          },
          quote_pooled_coin: {
            denom: 'okt',
            amount: /(0\.00000000)|(10\.00000000)/,
          },
          pool_token_coin: {
            denom: 'ammswap_eos-c9f_okt',
            amount: '100.00000000',
          },
          pool_token_ratio: '0.042',
        },
      ],
    });
  },
  addInfo(url) {
    Mock.mock(url, {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        base_token_amount: '19.88846512',
        pool_share: '0.58',
      },
    });
  },
  redeemableAssets(url) {
    Mock.mock(url, {
      code: 0,
      msg: '',
      detail_msg: '',
      data: [
        {
          denom: 'okt',
          amount: '20.00599400',
        },
        {
          denom: 'rxb-276',
          amount: '19.99402576',
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
              amount: '9997.01288057',
            },
            base_pooled_coin: {
              denom: 'okt',
              amount: '10002.99700300',
            },
            pool_token_name: 'ammswap_okt_rxb-276',
          };
    Mock.mock(url, {
      code: 0,
      msg: '',
      detail_msg: '',
      data,
    });
  },
  watchlist(url) {
    Mock.mock(url, {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        'data|10': [
          {
            swap_pair: 'eos-d07_okt',
            liquidity: '2411223',
            volume24h: '23423234',
            fee_apy: '102.12%',
            last_price: '10.123',
            change24h: '-0.1212',
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
