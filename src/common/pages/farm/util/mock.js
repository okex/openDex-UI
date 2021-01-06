const Mock = require('mockjs');

const data = {
  "pool_name":"aaa-882_okt",
  "lock_symbol":"okt",
  "yield_symbol":"aaa-882",
  "total_staked":"0.000000000000000000",
  "start_at":1609899987,
  "finish_at":1609999987,
  "pool_rate":[
      {
          "denom":"aaa-882",
          "amount":"288000.000000000000000000"
      },
      {
        "denom":"okt",
        "amount":"0.000000000000000000"
      }
  ],
  "farm_apy":[
      {
          "denom":"aaa-882",
          "amount":"0.000000000000000000"
      },
      {
        "denom":"okt",
        "amount":"0.000000000000000000"
    }
  ],
  "pool_ratio":"0",
  "total_farmed":"0",
  "claimed":[

  ],
  "unclaimed":[

  ],
  "farmed_details":[
    {
        "symbol":"aaa-882",
        "claimed":"0",
        "unclaimed":"1.000000000000000000"
    }
  ]
}
const param_page = {
  "page":1,
  "per_page":50,
  "total":100
}
module.exports = {
  whitelist(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        'data|10':[data],
        param_page
      },
    });
  },
  normal(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        'data|10':[data],
        param_page
      },
    });
  },
  dashboard(url) {
    Mock.mock(RegExp(`${url}.*`), {
      code: 0,
      msg: '',
      detail_msg: '',
      data: {
        'data|10':[data],
        param_page
      },
    });
  },
};
