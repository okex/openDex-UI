const Enum = {
  buy: 'buy',
  sell: 'sell',
  ajax: 'ajax',
  ws: 'websocket',
  spot: 'spot',
  margin: 'margin',
  tradeType: {
    normalTrade: 'normalTrade',
    fullTrade: 'fullTrade',
  },
  themes: {
    theme1: 'theme-1',
    theme2: 'theme-2',
  },
  spotOrMargin: {
    spot: 1,
    margin: 2,
  },
  defaultMergeType: '0.001',
  defaultMergeTypes: ['0.001', '0.01', '0.1'],
  placeOrder: {
    type: {
      buy: 1,
      sell: 2,
    },
    strategyType: {
      limit: 1,
      market: 2,
      plan: 3,
      track: 4,
      iceberg: 5,
      timeWeight: 6,
      advancedLimit: 7,
    },
    advancedOrderType: {
      postOnly: 2,
      FOK: 3,
      FAK: 4,
    },
  },
  order: {
    type: {
      noDeal: 0,
      history: 1,
      detail: 2,
    },
    entrustType: {
      normal: 0,
      plan: 1,
      track: 2,
      iceberg: 3,
      timeWeight: 4,
    },
    periodInterval: {
      oneDay: 'oneDay',
      oneWeek: 'oneWeek',
      oneMonth: 'oneMonth',
      threeMonth: 'threeMonth',
    },
  },
  noticeTypes: {
    1: { icon: 'icon-weekly', locale: 'notice.category.week' },
    2: { icon: 'icon-Monthly', locale: 'notice.category.month' },
    0: { icon: 'icon-Activitynotificatio', locale: 'notice.category.news' },
    3: { icon: 'icon-Newsflash', locale: 'notice.category.act' },
    4: { icon: 'icon-FinancialReport', locale: 'notice.category.treasure' },
    5: { icon: 'icon-Triggerorderfuben', locale: 'notice.category.rate' },
  },
};
export default Enum;
