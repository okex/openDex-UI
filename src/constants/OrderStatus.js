export const OrderStatus = {
  // 需要根据语义找到对应的状态码，还需要根据状态码找到对应的多语言配置
  Open: '0', // 未成交
  0: 'Open',

  Filled: '1', // 完全成交
  1: 'Filled',

  Cancelled: '2', // 已取消
  2: 'Cancelled',

  Expired: '3', // 已过期
  3: 'Expired',

  PartialFilledCancelled: '4', // 部分成交撤销
  4: 'PartialFilledCancelled',

  PartialFilledExpired: '5', // 部分成交过期
  5: 'PartialFilledExpired',

  PartialFilled: '6', // 部分成交
  6: 'PartialFilled',

  Cancelling: '100', // 撤单中
  100: 'Cancelling'
};

// 冰山和时间加权委托的状态列表
export const OrderStatusIceAndTime = {
  TO_BE_FILLED: '1', // 待生效
  1: 'toBeFilled',

  COMPLETE_FILLED: '2', // 已生效
  2: 'completeFilled',

  CANCELLED: '3', // 已撤销
  3: 'cancelled',

  PARTIAL_FILLED: '4', // 部分生效
  4: 'partialFilled',

  PAUSED: '5', // 暂停生效
  5: 'paused'
};

export const OrderType = {
  0: 'spot.orders.orderTypeShort.always',
  1: 'spot.orders.orderTypeShort.always',
  2: 'spot.orders.orderTypeShort.postOnly',
  3: 'spot.orders.orderTypeShort.FOK',
  FOK: '3',
  4: 'spot.orders.orderTypeShort.FAK',
  FAK: '4',
};
