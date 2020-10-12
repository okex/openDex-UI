let Mock = require('mockjs');

module.exports = {
  tokens(url) {
    Mock.mock(url, {
      "code": 0,
      "msg": "",
      "detail_msg": "",
      "data": {
        "native_token": "okt",
        "tokens": [
          {
            "symbol": "eos-d87",
            "available": "79999990000.00000000"
          },
          {
            "symbol": "okt",
            "available": "8974999.99200000"
          }
        ]
      }
    });
  },
  buyInfo(url) {
    Mock.mock(url,
      {
        "code": 0,
        "msg": "",
        "detail_msg": "",
        "data": {
          "buy_amount": "19.88846512",
          "price": "0.96",
          "price_impact": "0.78",
          "fee": "0.03okt",
          "route": "okt"
        }
      });
  },
  liquidityInfo(url) {
    Mock.mock(url, {
      "code": 0,
      "msg": "",
      "detail_msg": "",
      "data": [
        {
          "base_pooled_coin": {
            "denom": "eos-c9f",
            "amount": "0.00000000"
          },
          "quote_pooled_coin": {
            "denom": "okt",
            "amount": "0.00000000"
          },
          "pool_token_coin": {
            "denom": "ammswap_eos-c9f_okt",
            "amount": "0.00000000"
          },
          "pool_token_ratio": "0.042"
        }
      ]
    });
  },
  addInfo(url) {
    Mock.mock(url, {
      "code": 0,
      "msg": "",
      "detail_msg": "",
      "data": {
        "base_token_amount": "19.88846512",
        "price": "0.96",
        "pool_share": "0.58"
      }
    });
  },
  redeemableAssets(url) {
    Mock.mock(url, {
      "code": 0,
      "msg": "",
      "detail_msg": "",
      "data": [
        {
          "denom": "okt",
          "amount": "20.00599400"
        },
        {
          "denom": "rxb-276",
          "amount": "19.99402576"
        }
      ]
    });
  },
  tokenPair(url) {
    Mock.mock(url, {
      "code": 0,
      "msg": "",
      "detail_msg": "",
      "data": {
        "quote_pooled_coin": {
          "denom": "rxb-276",
          "amount": "9997.01288057"
        },
        "base_pooled_coin": {
          "denom": "okt",
          "amount": "10002.99700300"
        },
        "pool_token_name": "ammswap_okt_rxb-276"
      }
    });
  },
  createLiquidityTokens(url) {
    Mock.mock(url, {
      "code": 0,
      "msg": "",
      "detail_msg": "",
      "data": [
        {
          "description": "eos token",
          "symbol": "eos-c9f",
          "original_symbol": "eos",
          "whole_name": "eos",
          "original_total_supply": "80000000000.00000000",
          "type": "0",
          "owner": "okexchain10q0rk5qnyag7wfvvt7rtphlw589m7frsku8qc9",
          "mintable": true,
          "total_supply": "80000000000.00000000"
        },
        {
          "description": "OK Group Global Utility Token",
          "symbol": "okt",
          "original_symbol": "okt",
          "whole_name": "OKT",
          "original_total_supply": "1000000000.00000000",
          "type": "0",
          "owner": "okexchain10q0rk5qnyag7wfvvt7rtphlw589m7frsku8qc9",
          "mintable": true,
          "total_supply": "9000197.25000000"
        },
        {
          "description": "上币描述",
          "symbol": "rxb-276",
          "original_symbol": "rxb",
          "whole_name": "rxb",
          "original_total_supply": "80000000000.00000000",
          "type": "0",
          "owner": "okexchain10q0rk5qnyag7wfvvt7rtphlw589m7frsku8qc9",
          "mintable": true,
          "total_supply": "80000000000.00000000"
        }
      ]
    });
  },
  watchlist(url) {
    Mock.mock(url, {
      "code": 0,
      "msg": "",
      "detail_msg": "",
      "data": {
        "data": [
          {
            "swap_pair": "eos-d07_okt",
            "liquidity": "2411223",
            "volume24h": "23423234",
            "fee_apy": "102.12%",
            "last_price": "10.123",
            "change24h": "-0.1212"
          }
        ],
        "param_page": {
          "page": 1,
          "per_page": 50,
          "total": 1
        }
      }
    });
  }
}