const Enum = {
  buy: 'buy',
  sell: 'sell',
  ajax: 'ajax',
  ws: 'websocket',
  spot: 'spot',
  margin: 'margin',
  tradeType: {
    normalTrade: 'normalTrade', // 普通交易（非全屏）
    fullTrade: 'fullTrade', // 全屏交易
  },
  themes: {
    theme1: 'theme-1', // 白天模式
    theme2: 'theme-2', // 夜间模式
  },
  spotOrMargin: {
    spot: 1, // 币币模式
    margin: 2 // 杠杆模式
  },
  defaultMergeType: '0.001', // 默认深度合并系数
  defaultMergeTypes: ['0.001', '0.01', '0.1'], // 默认深度合并系数选项
  placeOrder: {
    type: { // 买卖类型
      buy: 1, // 买
      sell: 2 // 卖
    },
    strategyType: { // 委托类型
      limit: 1, // 限价单
      market: 2, // 市价单
      plan: 3, // 计划委托
      track: 4, // 跟踪委托
      iceberg: 5, // 冰山委托
      timeWeight: 6, // 时间加权委托
      advancedLimit: 7, // 高级限价单
    },
    advancedOrderType: { // 高级限价单类别
      postOnly: 2, // 只做Maker（Post only）
      FOK: 3, // 全部成交或立即取消（FillOrKill）
      FAK: 4, // 立即成交并取消剩余（ImmediatelOrCancel）
    },
  },
  order: {
    type: { // 一级tab
      noDeal: 0, // 未成交
      history: 1, // 历史
      detail: 2, // 成交明细
    },
    entrustType: { // 二级委托类型
      normal: 0, // 普通
      plan: 1, // 计划
      track: 2, // 跟踪
      iceberg: 3, // 冰山
      timeWeight: 4, // 时间加权
    },
    periodInterval: {
      oneDay: 'oneDay',
      oneWeek: 'oneWeek',
      oneMonth: 'oneMonth',
      threeMonth: 'threeMonth',
    }
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
