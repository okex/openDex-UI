export const OrderStatus = {
  Open: '0',
  0: 'Open',

  Filled: '1',
  1: 'Filled',

  Cancelled: '2',
  2: 'Cancelled',

  Expired: '3',
  3: 'Expired',

  PartialFilledCancelled: '4',
  4: 'PartialFilledCancelled',

  PartialFilledExpired: '5',
  5: 'PartialFilledExpired',

  PartialFilled: '6',
  6: 'PartialFilled',

  Cancelling: '100',
  100: 'Cancelling',
};

export const OrderStatusIceAndTime = {
  TO_BE_FILLED: '1',
  1: 'toBeFilled',

  COMPLETE_FILLED: '2',
  2: 'completeFilled',

  CANCELLED: '3',
  3: 'cancelled',

  PARTIAL_FILLED: '4',
  4: 'partialFilled',

  PAUSED: '5',
  5: 'paused',
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
