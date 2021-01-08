const zhCN = {
  'error.code.60000': '输入参数缺失',
  'error.code.60001': '非法的请求参数',
  'error.code.60002': '内部服务错误',
  'error.code.60003': '数据为空',
  'error.code.60004': '解析服务内部值失败',
  'error.code.60005': '内部abci查询失败',
  'error.code.60006': '参数数量限制',
  'error.code.60007': '输入地址不合法',
  'error.code.60300': '订单不存在',
  'error.code.60301': '非法的金额',
  'error.code.60302': 'instrument_id为空',
  'error.code.60303': 'instrument_id不存在',
  'error.code.60600': '输入地址不合法',
  'error.code.60700': 'validator地址不合法',
  'error.code.60701': 'delegator地址不合法',
  'error.code.60100': '内部错误',
  'error.code.60101': '输入的页码不合法',
  'error.code.60102': '输入的地址不合法',
  'error.code.60103': '无法解析结果至json格式',
  'error.code.60104': '无法序列化req数据',
  'error.code.60105': '字符串转换失败',
  'error.code.60106': '未知的提案类型',
  'error.code.60107': 'coin不足',
  'error.code.61000': '无效资产',
  'error.code.61001': '接受人在受限名单',
  'error.code.61002': '转账功能未开启',
  'error.code.61003': '发送到module账户失败',
  'error.code.61004': '无法识别锁定币种',
  'error.code.61005': '解锁地址失败',
  'error.code.61006': '无效币种',
  'error.code.61007': '价格位数无效',
  'error.code.61008': '低于最小交易数量',
  'error.code.61009': '地址为空',
  'error.code.61010': '获取token owner失败',
  'error.code.61011': '更新币种失败',
  'error.code.61012': '未知的查询路径',
  'error.code.61013': 'symbol未输入',
  'error.code.61014': 'symbol参数不合法',
  'error.code.61015': 'wholename参数不合法',
  'error.code.61016': 'desc内容超过规定长度',
  'error.code.61017': 'totoal supply 未处于合理范围内',
  'error.code.61018': 'amount数量超过了规定最大值',
  'error.code.61019': 'amount不合法',
  'error.code.61020': 'symbol参数为空',
  'error.code.61021': '铸币失败',
  'error.code.61022': '从module账户转到个人账户失败',
  'error.code.61023': '销毁币失败',
  'error.code.61024': '过期时间已失效',
  'error.code.61025': 'whole name 和 desc 值未改变',
  'error.code.61026': '该token不可增发',
  'error.code.61027': '目标转移地址数量超过限制',
  'error.code.61028': '输入的owner与token owner不匹配',
  'error.code.61029': '输入的地址不是token owner',
  'error.code.61030': '输入的owner与需要确认的owner不匹配',
  'error.code.61031': '字符串转数字失败',
  'error.code.61032': '新增后的总量已超过可发行数量上限',
  'error.code.62000': '币对必填',
  'error.code.62001': '地址必填',
  'error.code.62002': '订单状态必须是已成交或已关闭',
  'error.code.62003': '地址，base和quote不能为空',
  'error.code.62004': '获取区块高度失败',
  'error.code.62005': '获取区块哈希失败',
  'error.code.62006': '交易方向必须为buy或sell',
  'error.code.62007': '币对不存在',
  'error.code.62008': '后端模块未开启',
  'error.code.62009': 'goroutine异常',
  'error.code.62010': '后端模块未知请求',
  'error.code.62011': '获取K线失败',
  'error.code.62012': '获取k线失败',
  'error.code.62013': '获取行情失败',
  'error.code.62014': '参数不正确',
  'error.code.62015': '构建k线失败',
  'error.code.62016': '行情模块未被正确初始化',
  'error.code.62017': '获取K线时时间粒度参数不正确',
  'error.code.62018': '获取无效的行情数据',
  'error.code.63000': '该地址为无效地址',
  'error.code.63001': '参数无效',
  'error.code.63002': '币对不存在',
  'error.code.63003': '转账失败',
  'error.code.63004': '当前交易对正在下架',
  'error.code.63005': '价格设置已超过最大精度',
  'error.code.63006': '数量设置已超过最大精度',
  'error.code.63007': '数量应该大于最小单位',
  'error.code.63008': '订单不存在',
  'error.code.63009': '查询币对失败',
  'error.code.63010': '当前币对被锁定',
  'error.code.63011': '没有取消的订单',
  'error.code.63012': '订单不是开启状态',
  'error.code.63013': '订单不存在',
  'error.code.63014': '未知订单查询类型',
  'error.code.63015': '订单数量大于上限',
  'error.code.63016': '订单数量为空',
  'error.code.63017': '订单的币对数量为空',
  'error.code.63018': '订单的币对格式错误',
  'error.code.63019': '订单的币对名称相同',
  'error.code.63020': '订单方向只能为买和卖',
  'error.code.63021': '订单条目的价格或数量为负',
  'error.code.63022': '订单ID为空',
  'error.code.63023': '取消订单数不能大于上限',
  'error.code.63024': '重复的订单ID',
  'error.code.63025': '订单id为空',
  'error.code.63026': '发送者地址应该和订单发送地址相同',
  'error.code.63027': '需要一个币对',
  'error.code.63028': '所有新创建的订单都执行失败了',
  'error.code.64000': '地址，base和quote不能为空',
  'error.code.64001': '无效交易对',
  'error.code.64002': '未发现该交易对',
  'error.code.64003': '余额不足',
  'error.code.64004': '无效资产',
  'error.code.64005': '未知运营方地址',
  'error.code.64006': '运营方地址已存在',
  'error.code.64007': '网站url过长',
  'error.code.64008': '无效的url',
  'error.code.64009': '保存币对失败',
  'error.code.64010': '手续费币种不足',
  'error.code.64011': '币对已存在',
  'error.code.64012': '不是币对所有者',
  'error.code.64013': '需抵押指定币种',
  'error.code.64014': '抵押数量不足',
  'error.code.64015': '提取抵押金失败',
  'error.code.64016': '超额提取抵押金',
  'error.code.64017': '提取失败',
  'error.code.64018': '不是币对所有人',
  'error.code.64019': '无效币种',
  'error.code.64020': '接受币对所有权超时',
  'error.code.64021': '存币失败',
  'error.code.64022': '提币失败',
  'error.code.64023': '确认币对所有权失败',
  'error.code.64024': '币对是需要的',
  'error.code.64025': '币对被锁定',
  'error.code.64026': '未知消息类型',
  'error.code.64027': '未知请求类型',
  'error.code.64028': '发行价价格应为正',
  'error.code.64029': '缺失地址',
  'error.code.64030': '币对不存在',
  'error.code.64031': '币对所有权正在转移，暂不支持抵押',
  'error.code.64032': '币对转移已过期',
  'error.code.64033': '当前地址不是operator所有者',
  'error.code.65000': '该token  pair并不存在',
  'error.code.65001': '该token并不存在',
  'error.code.65002': '增发lp token失败',
  'error.code.65003': '转账失败',
  'error.code.65004': '币对排序错误',
  'error.code.65005': '验证币对名字失败',
  'error.code.65006': 'base和quote名字相同',
  'error.code.65007': 'token名称未通过校验',
  'error.code.65008': 'lp token名不可以为base或quote token',
  'error.code.65009': '余额不足',
  'error.code.65010': '该token并不存在',
  'error.code.65011': '创建交易池失败',
  'error.code.65012': '无效币对',
  'error.code.65013': '地址缺失',
  'error.code.65014': '为零值',
  'error.code.65015': '区块时间超过限制',
  'error.code.65016': '输入数值超出系统上限',
  'error.code.65017': '生产lp token失败',
  'error.code.65018': '发送token失败',
  'error.code.65019': '销毁lp token失败',
  'error.code.65020': '发送 token失败',
  'error.code.65021': '未知消息类型',
  'error.code.65022': '未知swap查询类型',
  'error.code.65023': '售卖或购买的token数量为0',
  'error.code.65024': '售卖token名称应该等于购买token名称',
  'error.code.65025': '查询地址为空',
  'error.code.65026': '查询quote token为空',
  'error.code.65027': '查询base token为空',
  'error.code.65028': '最小流动性为负',
  'error.code.65029': 'base或quote数量为负',
  'error.code.65030': '最大base数量为负或面值无效',
  'error.code.65031': 'quote数量为负或面值无效',
  'error.code.65032': '最小base数量为负或面值无效',
  'error.code.65033': '最小quote数量为负或面值无效',
  'error.code.65034': '售卖token数量为负',
  'error.code.65035': 'token0名称等于token1',
  'error.code.65036': '售卖token数量为负或面值无效',
  'error.code.65037': '购买token数量为负或面值无效',
  'error.code.65038': '无效参数，解析售卖token数量失败',
  'error.code.65039': '无效参数，解析quote token数量失败',
  'error.code.65040': '转账失败',
  'error.code.65041': '输入的最后期限小于当前区块时间',
  'error.code.65042': 'base token数量大于限制',
  'error.code.65043': 'swap币对已存在',
  'error.code.65044': 'pool币对已存在',
  'error.code.65045': '内部错误',
  'error.code.66000': '无效输入',
  'error.code.66001': '交易池已经存在',
  'error.code.66002': '未发现farm pool',
  'error.code.66003': '当前池子未在白名单',
  'error.code.66004': '获得锁定信息失败',
  'error.code.66005': 'token并不存在',
  'error.code.66006': '销毁失败',
  'error.code.66007': 'proposal类型不合法',
  'error.code.66008': '地址未填',
  'error.code.66009': '无法向池子中注入奖励',
  'error.code.66010': '不是池子的owner',
  'error.code.66011': '无效的币种',
  'error.code.66012': '转账失败',
  'error.code.66013': '未知消息类型',
  'error.code.66014': '未知查询类型',
  'error.code.66015': '无效金额',
  'error.code.66016': '余额不足',
  'error.code.66017': '无效高度',
  'error.code.66018': '无效pool name长度',
  'error.code.66019': '锁仓金额过少',
  'error.code.66020': '从module账户到普通账户转账失败\t',
  'error.code.66021': '币对在swap中不存在',
  'error.code.67000': 'Validators不存在',
  'error.code.67001': '无效委托',
  'error.code.67002': 'validator地址为空',
  'error.code.67003': 'Validators地址无效',
  'error.code.67004': '最小自委托大于其对应的权重',
  'error.code.67005': 'proxy不存在',
  'error.code.67006': 'validators为空',
  'error.code.67007': 'proxy已存在',
  'error.code.67009': '发送人地址和delegator地址不同',
  'error.code.67010': '空描述',
  'error.code.67011': '获取共识公钥失败',
  'error.code.67012': '未知staking查询类型',
  'error.code.67013': 'validator operator已存在',
  'error.code.67014': 'validator pubkey已存在',
  'error.code.67015': '无效的validator pubkey类型',
  'error.code.67016': 'bonded pool或not bonded pool为空',
  'error.code.67017': '描述长度不符合要求',
  'error.code.67018': '佣金率必须正',
  'error.code.67019': '佣金率不能超过100%',
  'error.code.67020': '佣金率不能超过最大佣金率',
  'error.code.67021': '24小时内只能修改一次佣金率',
  'error.code.67022': '修改的佣金率必须是正数',
  'error.code.67023': '修改后的佣金率不能超过最大佣金率',
  'error.code.67024': '佣金率修改增量不能超过最大修改允许值',
  'error.code.67025': '最小自委托必须是正数',
  'error.code.67026': 'delegator地址为空',
  'error.code.67027': 'delegator地址不能与proxy地址相等',
  'error.code.67028': '无效的币种',
  'error.code.67029': '金额必须大于0',
  'error.code.67030': 'unbonding委托不存在',
  'error.code.67031': '无法向销毁的validator投票',
  'error.code.67032': '已经委托给代理，无法再投票给validator',
  'error.code.67033': 'proxy无法bind到其他proxy',
  'error.code.67034': '超过了最大validator数量',
  'error.code.67035': 'delegation不存在',
  'error.code.67036': '状态不为undelegating',
  'error.code.67037': '解委托数量大于委托数量',
  'error.code.67038': '委托数量小于最小委托量',
  'error.code.67039': '最小自委托为0',
  'error.code.67040': '解除委托数量必须大于0',
  'error.code.67041': '更新后的委托数量为负',
  'error.code.67042': 'proxy在取回tokens前必须注销',
  'error.code.67043': 'delegator在投票后无法绑定到proxy',
  'error.code.67044': 'delegator不存在',
  'error.code.67045': '重复的validators',
  'error.code.67046': 'delegator已经绑定到proxy，无法注册proxy',
  'error.code.67800': 'delegator地址为空',
  'error.code.67801': '无Validator佣金可供提取',
  'error.code.67802': '设置提币地址功能已关闭',
  'error.code.67803': '无效路由',
  'error.code.67804': '提取validator奖励和佣金失败',
  'error.code.67805': 'bech32地址转换失败',
  'error.code.67806': 'bech32 validator地址转换失败',
  'error.code.67807': '从module账户到普通账户转账失败',
  'error.code.67808': '提取佣金失败',
  'error.code.67809': '未知的消息类型',
  'error.code.67810': '未知的提案类型',
  'error.code.67811': '未知的查询类型',
  'error.code.67812': '未知的分红模块参数类型',
  'error.code.67813': '领取地址在黑名单中',
  'error.code.67814': '领取地址为空',
  'error.code.67815': 'validator地址为空',
  'error.code.67816': 'community池余额不足',
  'error.code.67817': '无效的community池支出金额',
  'error.code.67818': '无效的community池支出接受地址',
  'error.code.68000': '无效地址',
  'error.code.68001': '未知提案',
  'error.code.68002': '无效提案内容',
  'error.code.68003': '提案类型无效',
  'error.code.68004': '无效投票行为',
  'error.code.68005': '初始提案ID未设置',
  'error.code.68006': '未知提案',
  'error.code.68007': '当前提案状态无法执行此操作',
  'error.code.68008': '发起提案初始抵押不足',
  'error.code.68009': '无效提案人',
  'error.code.68010': '提案指定区块高度不满足要求',
  'error.code.68011': '无效币种',
  'error.code.68012': '未知参数类型',
  seoTitle: '去中心化交易平台DEX',
  borrow: '借',
  needBorrow: '需借 ',
  repay: '还',
  sysError: '系统错误，请稍后再试。',
  operationSuccessful: '操作成功',
  on: '开',
  off: '关',
  cancel: '取消',
  search: '搜索',
  pair: '币对',
  price: '最新价',
  change: '涨幅',
  volume: '成交量',
  login: '登录',
  signUp: '注册',
  phone: '手机',
  email: '邮箱',
  settings: '更改设置',
  symbolDesc: '描述：',
  symbolWholeName: '全称：',
  symbolId: '币种ID：',
  'spot.noData': '暂无数据',
  'spot.asset': '资产',
  'spot.asset.marginTrade': '杠杆交易',
  'spot.asset.newMarginTrade': '杠杆交易',
  'spot.asset.spotTrade': '币币交易',
  'spot.asset.dexTest': 'DEX交易',
  'spot.account.spot': '币币账户',
  'spot.asset.futureTrade': '交割合约交易',
  'spot.asset.optionsTrade': '期权合约交易',
  'spot.asset.futureswapTrade': '永续合约交易',
  'spot.asset.ava': '可用',
  'spot.asset.borrow': '已借',
  'spot.asset.freeze': '冻结',
  'spot.asset.risk': '风险率',
  'spot.asset.forceClose': '爆仓价',
  'spot.asset.interest': '利息',
  'spot.asset.deposit': '充{currency}',
  'spot.asset.transfer': '转入资产',
  'spot.asset.transferSuccess': '划入成功',
  'spot.asset.borrowBill': '借币',
  'spot.asset.goBorrow': '去借币',
  'spot.asset.borrowBillSuccess': '借币成功',
  'spot.asset.repayBill': '还币',
  'spot.asset.repayBillSuccess': '还币成功',
  'spot.asset.repayBonus': '还糖果',
  'spot.asset.repayBonus.tips-0':
    '您的借币{currency}需要归还糖果{bonus}，请在币币账户中留足{bonus}',
  'spot.asset.repayBonus.tips-1': '1、未还糖果资产会计入负债计算风险率',
  'spot.asset.repayBonus.tips-2': '2、未还清糖果，该币对杠杆账户资产不可转出',
  'spot.bills.allCurrency': '全部币种',
  'spot.bills.allProduct': '全部币对',
  'spot.bills.coin': '币种',
  'spot.bills.tradeDate': '成交时间',
  'spot.bills.tradeType': '类型',
  'spot.bills.allTradeType': '全部类型',
  'spot.bills.tradeAmount': '数量',
  'spot.bills.balance': '余额',
  'spot.bills.fee': '手续费',
  'spot.bills.clearTips':
    '为了提升系统性能，我们会根据空间情况，定期清除部分用户3个月前的历史数据。',
  'spot.bills.sentOngoing':
    '您所需的历史数据正在查询中，预计在10分钟内，下载链接将发送至您的{contactType}{contact}。如有其它问题，请联系在线客服。',
  'spot.bills.sentConflict':
    '您当前仍有查询任务正在进行中，查询完成后，下载链接将发送至您的{contactType}{contact}。如有其它问题，请联系在线客服。',
  'spot.bills.sentTooMany':
    '对不起，您所下载数据量太大，请分批下载（目前单次下载最多支持1000万条数据）。',
  'spot.coin': '币种',
  'spot.marketDict': '市场',
  'spot.favorites': '自选',
  'spot.market.more': '查看更多',
  'spot.market.orders': '交易信息',
  'spot.menu.market.orders': '币币委托',
  'spot.menu.market.bills': '币币账单',
  'spot.menu.market.currencyIntro': '币种介绍',
  'spot.menu.market.marginIntro': '杠杆解释说明',
  'spot.menu.market.marginGuide': '教你玩转杠杆',
  'spot.menu.market.history': '借币历史记录',
  'spot.menu.market.strategy': '策略委托说明',
  'spot.menu.bills.force': '爆仓订单',
  'spot.menu.ready.risk': '风险准备金',
  'spot.bills.spot': '币币账单',
  'spot.bills.margin': '币币杠杆账单',
  'spot.orders.currencies': '币对',
  'spot.orders.types': '过滤器',
  'spot.orders.last2': '最近两天',
  'spot.orders.2daysago': '两天以前',
  'spot.search': '查询',

  'spot.myOrder.detail': '成交明细',
  'spot.myOrder.hash': '哈希值',
  'spot.myOrder.date': '委托时间',
  'spot.myOrder.product': '币对',
  'spot.myOrder.direction': '方向',
  'spot.myOrder.filledPercentage': '成交比例',
  'spot.myOrder.amount': '委托总量',
  'spot.myOrder.price': '委托价',
  'spot.myOrder.money': '委托金额',
  'spot.myOrder.status': '状态',
  'spot.myOrder.operate': '操作',

  'spot.myOrder.filledPrice': '成交均价',
  'spot.myOrder.filledAmount': '已成交量',
  'spot.myOrder.filledStatus': '成交状态',
  'spot.myOrder.filledMoney': '成交额',

  'spot.myOrder.height': '区块高度',
  'spot.myOrder.id': '订单号',
  'spot.myOrder.fee': '手续费',

  'spot.myOrder.Open': '未成交',
  'spot.myOrder.Filled': '完全成交',
  'spot.myOrder.Cancelled': '已取消',
  'spot.myOrder.Expired': '已过期',
  'spot.myOrder.PartialFilledCancelled': '部分成交撤消',
  'spot.myOrder.PartialFilledExpired': '部分成交过期',
  'spot.myOrder.PartialFilled': '部分成交',
  'spot.myOrder.cancelFailed': '撤单失败',
  'spot.myOrder.cancelSuccessed': '撤单成功',
  'spot.myOrder.cancelNoDealTip':
    '未成交的订单撤销时将会收取手续费，是否确定撤单？',
  'spot.myOrder.cancelPartDealTip': '是否确定撤单？',

  'spot.orders.allOrders': '全部挂单',
  'spot.orders.amount': '数量',
  'spot.orders.averPrice': '平均成交价',
  'spot.orders.cancel': '撤单',
  'spot.orders.cancelled': '已撤销',
  'spot.orders.canceling': '撤单中',
  'spot.orders.cancelAll': '当前币对全撤',
  'spot.orders.date': '委托时间',
  'spot.orders.filled': '成交数量',
  'spot.orders.completeFilled': '完全成交',
  'spot.orders.noorders': '您暂时没有未完成订单',
  'spot.orders.noorders2day': '您最近两天没有已成交的历史挂单',
  'spot.orders.noorders2dayago': '您两天以前没有已成交的历史挂单',
  'spot.orders.more': '查看更多',
  'spot.orders.open': '尚未成交',
  'spot.orders.openOrders': '当前委托',
  'spot.orders.oneDay': '1天',
  'spot.orders.oneWeek': '1周',
  'spot.orders.oneMonth': '1月',
  'spot.orders.threeMonth': '3月',
  'spot.orders.unfinished': '未成交',
  'spot.orders.orderHistory': '历史委托',
  'spot.orders.partialFilled': '部分成交',
  'spot.orders.partial': '部分',
  'spot.orders.allProduct': '全部币对',
  'spot.orders.price': '价格',
  'spot.orders.side': '类别',
  'spot.orders.side.spot': '币币',
  'spot.orders.side.margin': '杠杆',
  'spot.orders.side.spotAndMargin': '币币&杠杆',
  'spot.orders.source': '订单来源',
  'spot.orders.status': '状态',
  'spot.orders.operation': '操作',
  'spot.orders.tips.datepicker': '请选择开始日期与结束日期',
  'spot.orders.tips.dateRange': '结束日期必须晚于开始日期',
  'spot.orders.title': '币币委托',
  'spot.orders.total': '金额',
  'spot.orders.type': '类型',
  'spot.orders.symbol': '币对',
  'spot.orders.side2': '方向',
  'spot.orders.toast.unhis': '历史委托暂不支持全部查询，请选择币对后进行查询',
  'spot.orders.historyRecord': '仅展示当前币对',
  'spot.orders.historyRescinded': '隐藏已撤销',
  'spot.orders.dealAveragePrice': '成交均价',
  'spot.orders.dealt': '已成',
  'spot.orders.entrustMoney': '委托金额',
  'spot.orders.entrustPrice': '委托价',
  'spot.orders.entrustMount': '委托总量',
  'spot.orders.direction': '方向',
  'spot.orders.myDealList': '我的挂单',

  'spot.orders.download': '下载',
  'spot.orders.timeUnit': '天',
  'spot.orders.timeUnitDay': '天',
  'spot.orders.timeUnitHour': '小时',
  'spot.orders.statusOnly': '状态',
  'spot.orders.operationOnly': '操作',

  'spot.orders.noOrders': '您暂时没有未成交的挂单',
  'spot.orders.noHistory': '您最近两天没有已成交的历史挂单',
  'spot.orders.noData': '您暂时还没有相关数据',
  'spot.order.noSpotBills': '您暂时没有币币账单信息',
  'spot.order.noMarginBills': '您暂时没有币币杠杆账单信息',
  'spot.order.noBorrowOrder': '您暂时没有借款中的订单',
  'spot.order.noPayoffOrder': '您暂时没有已还清的订单',
  'spot.orders.normalSell': '普通委托',

  'spot.orders.triggerPrice': '触发价格',
  'spot.orders.tradePrice': '委托价格',
  'spot.orders.activatePrice': '激活价格',
  'spot.orders.orderSuccess': '委托成功',
  'spot.orders.buySuccess': '买单委托成功',
  'spot.orders.sellSuccess': '卖单委托成功',
  'spot.orders.buyFail': '买单委托失败，请重试!',
  'spot.orders.sellFail': '卖单委托失败，请重试!',
  'spot.orders.status1': '待生效',
  'spot.orders.status2': '已生效',
  'spot.orders.status3': '已撤销',
  'spot.orders.rise': '上涨',
  'spot.orders.fall': '下跌',
  'spot.orders.higher': '高于',
  'spot.orders.lower': '低于',
  'spot.orders.entrustWords':
    '当价格{direction}至或{compare}{triggerPrice}{baseCurr}时，则以{tradePrice}{baseCurr}的价格{action}{amount}{tradeCurr}',
  'spot.orders.cancelExplanation0': '委托超时撤单',
  'spot.orders.cancelExplanation1': '用户手动撤单',
  'spot.orders.cancelExplanation3': '下单失败撤单',
  'spot.orders.actionBuy': '买入',
  'spot.orders.actionSell': '卖出',
  'spot.orders.triggerPop':
    '当市场最新成交价达到您设置的触发价格时，系统将自动按您设置的委托价格和数量下达限价委托单。',
  'spot.orders.triggerPopPlanOrder':
    '计划委托是指用户预先设置好委托单和委托单触发价格，当市场的最新成交价达到设置的触发价格时，系统即会将用户事先设置的委托单送入市场的交易策略。',
  'spot.orders.triggerPopDetail': '更多详情',
  'spot.orders.triggerPopLimitOrder':
    '限价单是指用户设置委托数量以及可接受的最高买价或最低卖价，当市场价格符合用户预期时，系统会以限价范围内的最优价格进行成交。',
  'spot.orders.triggerPopMarketOrder':
    '市价单是指用户以当前市场最优价格立即执行买入或者卖出。',
  'spot.orders.triggerPopTrackOrder':
    '跟踪委托无数量限制，跟踪委托被触发时下达的',
  'spot.orders.triggerPopTrackOrder2':
    '委托单数量以当时用户可下达的最大数量与用户跟踪委托设置的委托数量，两者中小者为准。',
  'spot.orders.triggerPopIcebergOrder':
    '冰山委托无数量限制，当冰⼭委托在委托时的可下单数量为0时，则冰山委托将被撤销。每个⽤户最多可同时持有6笔冰山委托。',
  'spot.orders.triggerPopTimeWeightOrder':
    '时间加权委托无数量限制，当时间加权委托在委托时的可下单数量为0时，则时间加权委托将被撤销。每个用户最多同时持有6笔时间加权委托。',
  'spot.orders.priceVariance': '委托深度',
  'spot.orders.priceVarianceExplain':
    '买单时，系统将以下达限价单时的买一价 * （1-委托深度）作为限价单的价格。卖单时，系统将以下达限价单时的卖一价 * (1+委托深度)作为限价单的价格。',
  'spot.orders.totalAmount': '委托总数',
  'spot.orders.totalAmountExplain': '您希望买入或卖出的总数量。',
  'spot.orders.avgAmount': '单笔均值',
  'spot.orders.avgAmountExplain':
    '系统将在您设置的数量的范围内，设定每次限价单的数量。',
  'spot.orders.priceLimit': '价格限制',
  'spot.orders.priceLimitExplain':
    '买单时，当最新成交价大于您设置的价格限制后，该冰山委托将暂停；卖单时，当最新成交价小于您设置的价格限制后，该冰山委托将暂停。',
  'spot.orders.filledCount': '已成交量',
  'spot.orders.entrustedCount': '已委托量',
  'spot.orders.partialStatus': '部分生效',
  'spot.orders.pausedStatus': '暂停生效',

  'spot.trade': '交易',
  'spot.menu.orders': '币币委托',
  'spot.app': 'app',
  'spot.ios': 'ios',
  'spot.web': '网页',
  'spot.android': '安卓',

  'spot.bid': '买',
  'spot.ask': '卖',
  'spot.amount': '数量',
  'spot.group': '深度合并',
  'spot.xDecimal': '位小数',
  'spot.singleDecimal': '位小数',
  'spot.10Decimal': '十位整数',
  'spot.100Decimal': '百位整数',
  'spot.1000Decimal': '千位整数',
  'spot.10000Decimal': '萬位整数',
  'spot.price': '价格',
  'spot.total': '金额',
  'spot.placeorder.pleaseEnter': '请输入',
  'spot.pwd': '资金密码',
  'spot.orderType': '委托类型',
  'spot.type': '类型',
  'spot.depth.amount': '数量',
  'spot.depth.sum': '累计',
  'spot.depth.backToCenter': '返回盘口',
  'spot.FullLimitOrder': '限价委托',
  'spot.limitOrder': '限价单',
  'spot.marketOrder': '市价单',
  'spot.planOrder': '计划委托',
  'spot.trackOrder': '跟踪委托',
  'spot.icebergOrder': '冰山委托',
  'spot.timeWeightOrder': '时间加权委托',
  'spot.shortLimitOrder': '限价',
  'spot.shortMarketOrder': '市价',
  'spot.market': '市价',
  'spot.buy': '买入',
  'spot.sell': '卖出',
  'spot.buyAndSell': '买&卖',
  'spot.buyin': '买入{currency}',
  'spot.sellout': '卖出{currency}',
  'spot.fee': '费率标准',
  'spot.fee.broker': '当前手续费费率：',
  'spot.fee.brokerMT': '挂单成交{maker}%，吃单成交{taker}%',
  'spot.submit.loading': '正在提交...',
  'spot.ava.buy': '可买',
  'spot.ava.sell': '可卖',

  'spot.callmarket.title': '价格发现',
  'spot.callmarket.title.all': '价格发现-第N阶段',
  'spot.callmarket.session': '第N阶段',
  'spot.callmarket.desc1': '只能下限价单，可以撤单',
  'spot.callmarket.desc2': '只能下限价单，不可以撤单',
  'spot.callmarket.ended': '已结束',
  'spot.callmarket.endedin': '距结束',
  'spot.callmarket.startedin': '距开始',
  'spot.callmarket.open': '预计开盘价',
  'spot.callmarket.matched': '申报匹配量',
  'spot.callmarket.unmatched': '申报未匹配量',
  'spot.callmarket.startingsoon': '暂未开始',

  'spot.place.tips.price': '请输入交易价格',
  'spot.place.tips.amount': '请输入交易数量',
  'spot.place.tips.total': '请输入交易总金额',
  'spot.place.tips.triggerPrice': '触发价格不能为空',
  'spot.place.tips.range': '回调幅度不能为空',
  'spot.place.tips.activatePrice': '激活价格不能为空',
  'spot.place.tips.orderPrice': '委托价格不能为空',
  'spot.place.tips.money2': '您的余额不足，请先充值',
  'spot.place.tips.minsize': '最小交易数量是',
  'spot.place.tips.greaterthan0': '总金额必须大于0',
  'spot.place.tips.minbuy': '最小买入',
  'spot.place.tips.minsell': '最小卖出',
  'spot.place.tips.pwd': '请输入交易密码',
  'spot.place.tips.must': '必须',
  'spot.place.tips.multiple': '的整数倍',
  'spot.place.tips.margin': '杠杆交易存在爆仓风险，请注意理性投资',
  'spot.place.tips.priceVariance': '委托深度不能为空',
  'spot.place.tips.totalAmount': '委托总数不能为空',
  'spot.place.tips.avgAmount': '单笔均值不能为空',
  'spot.place.tips.avgAmountLessThanMin': '单笔均值不能低于委托总数的千分之⼀',
  'spot.place.tips.avgAmountLargerThanMax': '单笔均值不能超过委托总数',
  'spot.place.tips.priceLimit': '价格限制不能为空',
  'spot.place.tips.priceVarianceNotGreaterThan': '委托深度不能大于{max}%',
  'spot.place.tips.timeWeight.priceVariance': '扫单范围不能为空',
  'spot.place.tips.timeWeight.priceVarianceNotGreaterThan':
    '扫单范围不能超过{max}%',
  'spot.place.tips.timeWeight.sweepRatio': '扫单比例不能为空',
  'spot.place.tips.timeWeight.sweepRatioNotGreaterThan':
    '扫单比例不能超过{max}%',
  'spot.place.tips.timeWeight.totalAmount': '委托总数不能为空',
  'spot.place.tips.timeWeight.priceLimitTrade': '单笔上限不能为空',
  'spot.place.tips.timeWeight.priceLimitTradeLessThanMin':
    '单笔上限不能小于委托总数千分之一',
  'spot.place.tips.timeWeight.priceLimitTradeLargerThanMax':
    '单笔上限不能大于委托总数',
  'spot.place.tips.timeWeight.priceLimitBase': '价格限制不能为空',
  'spot.place.tips.timeWeight.timeInterval': '委托间隔不能为空',
  'spot.place.tips.timeWeight.timeIntervalRange':
    '委托间隔不能小于{min}秒大于{max}秒',
  'spot.place.confirm.buy': '确认买入',
  'spot.place.confirm.sell': '确认卖出',
  'spot.place.confirm.normalTrade.buy': '输入资金密码',

  'spot.place.marketPrice': '按市场最优价格成交',
  'spot.place.forgetPwd': '忘记密码',
  'spot.place.nopwd': '免输资金密码',
  'spot.place.autoBorrowWarn': '完成此次交易您需借币',
  'spot.place.forcePrice': '预估爆仓价格',
  'spot.place.noWarn': '下次不再提醒',
  'spot.place.kline': 'K线',
  'spot.place.kline.title': '实时行情',
  'spot.place.kline.more': '更多',
  'spot.kline.noInfo': '暂无信息',
  'spot.place.fullScreen': '全屏交易',

  'spot.ticker.legal': '人民币价格',
  'spot.ticker.legal.new': '{currency}价格',
  'spot.ticker.legal.unit': '计价单位',
  'spot.ticker.highest': '24h最高价',
  'spot.ticker.lowest': '24h最低价',
  'spot.ticker.volume': '24h成交量',
  'spot.ticker.inflows': '24h资金流入',
  'spot.ticker.outflows': '24h资金流出',
  'spot.ticker.inflowTips': '过去24小时主动买入成交量',
  'spot.ticker.outflowTips': '过去24小时主动卖出成交量',

  'spot.deals.title': '最新交易',
  'spot.deals.price': '价格(-)',
  'spot.deals.amount': '数量(-)',
  'spot.deals.time': '时间',
  'spot.deals.no': '暂时没有最新成交',

  'spot.ticker.introduce.releaseTime': '发行时间',
  'spot.ticker.introduce.distributionAmount': '发行总量',
  'spot.ticker.introduce.circulationAmount': '流通总量',
  'spot.ticker.introduce.crowdfunding': '众筹价格',

  'spot.ticker.introduce.website': '官网',
  'spot.ticker.introduce.whitePaper': '白皮书',
  'spot.ticker.introduce.introduction': '介绍',

  'spot.kline.price': '成交价',
  'spot.kline.tabs[0]': '行情',
  'spot.kline.tabs[1]': '介绍',
  'spot.kline.tabs[2]': '公告',
  'spot.kline.tabs[3]': '评级报告',
  'spot.kline.tabs[2].more': '全部公告',
  'spot.kline.tabs[3].more': '全部评级报告',
  'spot.kline.tabs.news': '相关资讯',
  'spot.kline.tabs.news.more': '全部资讯',

  'spot.page.title': '- 全球领先的比特币/数字货币交易平台 |',
  'spot.page.title.tokens': '币币委托 ',

  'spot.notlogin.tradenow': '立即开始交易',
  'spot.notlogin.preview': '此页面为{site}交易的预览，所有信息均为实时数据',
  'spot.notlogin.logintoview1': '您必须',
  'spot.notlogin.logintoview2': '登录',
  'spot.notlogin.logintoview3': '才可看到此信息',

  'spot.all.bills': '全部账单',
  'spot.all.history': '全部借币历史记录',
  'spot.all.force': '全部爆仓订单',
  'spot.all.risk': '全部风险准备金',

  'notice.category.week': '周报',
  'notice.category.month': '月报',
  'notice.category.news': '快讯',
  'notice.category.act': '活动',
  'notice.category.treasure': '财报',
  'notice.category.rate': '评级报告',

  'spot.project.info': '项目披露',

  'spot.advancedLimitOrder': '高级限价委托',
  'spot.orders.triggerPopAdvancedLimitOrder':
    '高级限价委托相对于普通限价委托可选择三种生效机制，“只做Maker（Post only）”、“全部成交或立即取消（FillOrKill）”、“立即成交并取消剩余（ImmediatelOrCancel）”；而普通限价委托的生效机制默认是“一直有效”。',
  'spot.orders.orderType': '生效机制',
  'spot.orders.orderType.postOnly': '只做Maker（Post only）',
  'spot.orders.orderType.FOK': '全部成交或立即取消（FillOrKill）',
  'spot.orders.orderType.FAK': '立即成交并取消剩余（ImmediateOrCancel）',
  'spot.orders.orderTypeShort.always': '一直有效',
  'spot.orders.orderTypeShort.postOnly': 'Post only',
  'spot.orders.orderTypeShort.FOK': 'FillOrKill',
  'spot.orders.orderTypeShort.FAK': 'ImmediateOrCancel',
  'spot.place.tips.orderType':
    '该委托的生效机制。默认是“只做Maker（Post only）”，不会立刻在市场成交，保证用户始终为Maker；如果委托会立即与已有委托成交，那么该委托会被取消。如果你的委托被设置为“全部成交或立即取消（FillOrKill）”，该委托只会立即全部成交，否则将被取消。如果你的委托被设置为“立即成交并取消剩余（ImmediatelOrCancel）”，任何未被成交的部分将被立即取消。',
  'spot.orders.actionBuyMargin': '买入（做多）',
  'spot.orders.actionSellMargin': '卖出（做空）',

  'spot.depth.tooltip.sumTrade': '合计{trade}',
  'spot.depth.tooltip.sumBase': '合计{base}',
  'spot.depth.tooltip.avgPrice': '均价',

  all: '全部',
  go_back: '返回',
  next_step: '下一步',
  prev_step: '上一步',
  ensure: '确认',
  OK: '确定',
  please_select: '请选择',
  please_input_pwd: '请输入钱包密码',
  pwd_error: '密码错误',
  valuation: '估值',
  link_to_all: '点击查看全部<<',
  wallet_create_step1: '创建钱包',
  wallet_setPassword: '设置钱包密码',
  wallet_password_placeholder: '请输入至少10位，包含大小写字母和数字的密码',
  wallet_password_lengthValidate: '至少10位字符',
  wallet_password_chartValidate: '必须包含数字、大小写字母',
  wallet_twicePassword: '再次输入密码',
  wallet_passwordNotSame: '两次密码输入不一致',
  wallet_unsaveTip: '我确认DEX不会保存我的任何密码/助记词/Keystore/私钥',
  wallet_hadWallet: '已有钱包.',
  wallet_importNow: '立即导入>>',
  wallet_nextStep: '下一步',
  wallet_safeTip_title: '安全提示',
  wallet_safeTip_beforeKeystore: '请在安全环境下，下载',
  wallet_safeTip_afterKeystore:
    '文件，并记录您的助记词，为避免泄漏，请勿拍照或截屏',
  wallet_known: '知道了',
  wallet_create_step2: '备份助记词',
  wallet_create_backupMnemonic: '请将下列助记词按顺序进行备份',
  wallet_create_backupMnemonic_error: '未通过验证，请重新备份',
  wallet_create_beginValidate: '我已抄写完，开始验证',
  wallet_create_step3: '验证助记词',
  wallet_choiceMnemonicPre: '请选择编号为',
  wallet_choiceMnemonicSuf: '所对应的助记词',

  wallet_ensure: '确定',
  wallet_confirm: '确认',
  wallet_create_step4: '验证成功',
  wallet_mnemonicSuccess: '恭喜您，助记词已验证成功，请妥善保管！',
  wallet_toTrade: '立即开始交易',
  wallet_seePrivate: '查看私钥',
  wallet_privateKey: '私钥',
  wallet_import: '导入钱包',
  wallet_import_mnemonic: '助记词导入',
  wallet_import_upload_todo: '上传Keystore文件，可直接拖动至此',
  wallet_import_upload_doing: '上传中',
  wallet_import_upload_retry: '重新上传',
  wallet_import_passwordTip:
    '该密码为生成Keystore文件时设置的密码，若丢失则无法导入钱包',
  wallet_import_enterPassword: '请输入钱包密码',
  wallet_import_fileError: '文件格式错误/文件内容不合法',
  wallet_import_noFile: '请先上传Keystore文件',
  wallet_import_passwordError: '钱包密码错误',
  wallet_import_mnemonic_enter: '请输入助记词',
  wallet_import_mnemonic_splitTip: '不同单词请用空格分隔',
  wallet_import_mnemonic_error: '助记词非法',
  wallet_import_mnemonic_sessionPassword: '请设置一个临时密码',
  wallet_import_mnemonic_none: '助记词不能为空',
  wallet_import_private_enter: '请输入钱包私钥',
  wallet_import_password_placeholder: '请设置一个临时密码',
  wallet_import_private_error: '私钥非法',
  wallet_import_private_none: '私钥不能为空',

  wallet_import_sessionPasswordTip:
    '该密码只对本次登录有效，与其他场景下设置的密码无关',
  header_menu_trade: '交易',
  header_menu_order: '订单',
  header_menu_create_wallet: '创建钱包',
  header_menu_import_wallet: '导入钱包',
  header_menu_current_entrust: '当前委托',
  header_menu_history_entrust: '历史委托',
  header_menu_deal_entrust: '成交明细',
  header_menu_wallet: '链上钱包',
  header_menu_assets: '资产余额',
  header_menu_down_keystore: '下载keystore文件',
  header_menu_logout: '退出钱包',
  header_menu_logout1: '确定要退出当前钱包',
  header_menu_help: '帮助',
  header_menu_instructions: '说明文档',
  header_menu_draw_okdex: '领取测试币',
  header_menu_item_address: '地址',
  header_menu_explorer_okchain: '浏览器',
  footer_standard_rates: '费率标准',

  home_banner_title: 'OKEx DEX',
  home_banner_subtitle: '无边界去中心化交易平台',
  home_banner_btn_trade: '开始交易',
  home_adv_title: '产品优势',
  home_adv_item0_title: '安全可靠',
  home_adv_item0_content:
    '依靠Secp256k1椭圆曲线算法，用户数字资产存放在自己的钱包中，无需托管即可交易',
  home_adv_item1_title: '快捷便利',
  home_adv_item1_content:
    'OKEx DEX严格审核链上资产，以价值稳定数字资产作为计价货币，提供多种交易选择',
  home_adv_item2_title: '持续迭代',
  home_adv_item2_content:
    'OKEx DEX会第一时间支持OKExChain的各项新功能，提供更优的交易体验',
  home_exp_title: '体验模拟交易',
  home_exp_content:
    '已经创建过OKExChain钱包的OKEx用户，我们将会为您发放一定数量的测试币，数量有限，先到先得。',
  home_steps_title: '快速开始',
  home_steps_item0_title: '1.创建OKExChain钱包',
  home_steps_item0_content:
    'DEX不会保存您链上钱包的任何信息；助记词和keystore文件是您拥有个人资产的唯一凭证，请妥善保管，若已经创建完成，您可以直接导入钱包。',
  home_steps_item0_button: '创建钱包',
  home_steps_item1_title: '2.钱包充值',
  home_steps_item1_content:
    '登录OKExChain链上钱包，进入资产管理，获得OKExChain链上地址；测试网可以通过领取测试币直接参与DEX交易；到账记录可在链上钱包——资产记录里面查看。',
  home_steps_item1_button: '领取测试币',
  home_steps_item2_title: '3.去交易',
  home_steps_item2_content:
    '使用领取的测试币在任意交易对进行交易；您的每次下单、撤单操作都会生成一个哈希值，被广播至区块链网络。',
  home_steps_item2_button: '立即交易',
  home_steps_item3_title: '4.查看交易信息',
  home_steps_item3_content:
    '每一笔交易、转账都可以通过交易哈希值、地址等在区块链浏览器中查询相应信息。',
  home_steps_item3_button: '查看区块数据',
  home_steps_item0_img:
    'https://static.bafang.com/cdn/assets/imgs/209/8C303F4EB6749D70.png',
  home_steps_item1_img:
    'https://static.bafang.com/cdn/assets/imgs/MjAyMDQ/EA5B9697721EAAE780B6A0D18D5F6DE5.png',
  home_steps_item2_img:
    'https://static.bafang.com/cdn/assets/imgs/MjAyMDQ/0A848CAA0FA942D868854F6F469ADEC1.png',
  home_steps_item3_img:
    'https://static.bafang.com/cdn/assets/imgs/209/343B60DBDE22127D.png',
  home_exp_more: '想要进一步了解「DEX、OKExChain详细设计规则」',
  home_exp_img:
    'https://static.bafang.com/cdn/assets/imgs/MjAyMDQ/3AF196CA9B03F9FFAE8A519469FBB6AD.png',
  home_subtitle: 'OKExChain测试网上线，所有交易记录链上可查',
  home_receive_coin: '领取测试币',
  home_step5_title: '帮助文档',

  assets_tab_accounts: '资产余额',
  assets_tab_transactions: '交易记录',
  assets_address: '地址：',
  assets_product_search: '币种搜索',
  assets_hide_zero: '隐藏零余额资产',
  assets_empty: '暂无资产',
  assets_column_assets: '资产',
  assets_column_total: '总量',
  assets_column_balance: '可用',
  assets_column_freeze: '冻结',
  assets_column_list: '挂单',
  assets_trans_btn: '转账',
  assets_copy_success: '复制成功',
  trade_query_begin: '起始时间',
  trade_query_end: '截止时间',
  trade_query_order_type: '订单类型',
  trade_query_more: '更多交易记录请在区块链浏览器查看',
  trade_query_search: '查询',
  trade_emtpy: '暂无交易记录',
  trade_column_hash: '交易哈希',
  trade_column_time: '时间',
  trade_column_assets: '资产',
  trade_column_type: '交易类型',
  trade_column_direction: '方向',
  trade_column_amount: '金额',
  trade_column_fee: '手续费',
  trade_type_order: '下单',
  trade_type_cancle: '撤单',
  trade_type_trans: '转账',
  trade_type_receive: '收款',
  trade_type_pay: '付款',
  trade_type_buy: '买',
  trade_type_sell: '卖',
  trans_address: '转账地址',
  trans_step_1: '转账',
  trans_step_2: '请确认交易信息',
  trans_choose_token: '选择币种',
  trans_no_token_found: '搜索不到币种',
  trans_err_addr_format: '地址格式错误',
  trans_err_addr_same: '不能给自己转账',
  trans_amount: '转账数量',
  trans_available: '可转账数量：',
  trans_available_not_enough: '余额不足',
  trans_fee: '手续费',
  trans_fee_not_enough: '手续费不足',
  trans_note: '备注',
  trans_middle_step_show_token: '选择币种',
  trans_middle_step_show_sender: '我的地址',
  trans_middle_step_show_taker: '收款地址',
  trans_middle_step_show_amount: '转账数量',
  trans_middle_step_show_fee: '手续费',
  trans_middle_step_show_note: '备注',
  trans_err_pwd: '密码错误',
  trans_success: '转账成功',
  trans_fail: '转账失败',
  group_hot: '热门榜',
  group_new: '打新榜',

  'node.main.title': 'Node settings',
  'node.active.title': 'Active Node',
  'node.delay.type.low': 'Low latency',
  'node.delay.type.high': 'High latency',
  'node.delay.type.unreachable': 'Unreachable',
  'node.tab.wellenow': 'WELLENOW',
  'node.tab.local': 'Local',
  'node.tab.customerlize': 'CUSTOMERLIZE',
  'dex.help.title': 'Is there a problem in DEX operator',
  'dex.help.item1': '-  DEX Operators Overview',
  'dex.help.item2': '-  DEX Operators Guide (CLI)',
  'dex.help.item3': '-  DEX Operators  FAQ',
  'register.website.label': 'Website',
  'register.website.hint':
    'Other partners in the ecosystem can get more information through websita. Such as logo, community contact information, etc.',
  'register.feeAddress.label': 'HandlingFeeAddress',
  'register.feeAddress.hint':
    'For security reasons, you can designate another address to collect handling fees.',
  'issueToken.symbol.label': 'Symbol',
  'issueToken.symbol.hint':
    'symbol is a non-case-sensitive token ticker limited to 6 alphanumeric characters, but the first character cannot be a number, eg. “bcoin” since the system will automatically add 3 random characters, such as “bcoin-gf6”',
  'issueToken.wholename.label': 'Wholename',
  'issueToken.totalSupply.label': 'TotalSupply',
  'issueToken.desc.label': 'Desc',
  'issueToken.mintable.label': 'Mintable',
  'issueToken.issue.btn': 'Issue',
  'listToken.label': 'BaseAsset/QuoteAsset',
  'listToken.list.btn': 'List',
  'listToken.hint': 'Not yet the DEX operation?',
  'listToken.hint.register': 'Register',
  'listToken.initPrice.label': 'Init-price',
  'productList.favorite': '我的关注',
  'productList.owner': '按运营方查询',
  'productList.token': '按交易对查询',
  'productList.noFavorite': '暂无关注',
  'productList.noResult': 'No Results Found',
  'productList.item.pair': '交易对',
  'productList.item.change': '涨幅',
  'productList.item.owner': '运营商',
  'productList.item.deposit': '撮合金',
  'linkMenu.Dashboard': 'Dashboard',
  'linkMenu.Token': 'Token',
  'linkMenu.operator': 'DEX Operator',
  'linkMenu.version': 'Version',
  'linkMenu.register': 'Register',
  'linkMenu.tokenPair': 'List TokenPair',
  'linkMenu.deposits': 'Add Deposits',
  'linkMenu.handlingFee': 'HandlingFee',
  'linkMenu.issue': 'Issue',
  'linkMenu.mintBurn': 'Mint&Burn',
  'nodeMenu.remote': 'Remote Node',
  'nodeMenu.block': 'Block',
  'nodeMenu.latency': 'Latency',
  'nodeMenu.local': 'Local Node',
  'nodeMenu.more': 'more',
  'node.stopped': 'Stopped',
  tokenPair_emtpy: 'No TokenPair',
  issue_empty: 'No Issue',
  dashboard_more: 'More',
  dashboard_asset_title: 'My Asset',
  dashboard_tokenPair_title: 'My List TokenPair',
  tokenPair_column_tokenPair: 'TokenPair',
  tokenPair_column_birth: 'BirthDay',
  tokenPair_column_deposit: 'Deposits',
  tokenPair_column_rank: 'Rank',
  tokenPair_cell_add: 'Add',
  tokenPair_cell_withdraw: 'Withdraw',
  dashboard_issue_title: 'My Issue',
  issue_cell_mint: 'Mint',
  issue_cell_burn: 'Burn',
  issue_column_token: 'Token',
  issue_column_mintable: 'Mintable',
  issue_column_original: 'Original totalsupply',
  issue_column_total: 'Totalsupply',
  dashboard_transaction_title: 'Transaction',
  seoSwapTitle: '去中心化交易平台SWAP',
  'spot.asset.swap': 'SWAP交易',
  Swap: '兑换',
  Pool: '资金池',
  Watchlist: '行情',
  From: '支付',
  Balance: '余额',
  Price: '价格',
  'Minimum received': '最少可获得',
  'Price Impact': '价格影响',
  'Liquidity Provider Fee': '手续费',
  Route: '交易路径',
  'Connect Wallet': '连接钱包',
  'Invalid Pair': '无效交易对',
  'To(estimated)': '兑换成 (约)',
  'Select a token': '选择代币',
  'Input an amount': '输入数量',
  'Search name': '搜索名词',
  'No Records': '无记录',
  'Add Liquidity': '添加流动性',
  'Your Liquidity': '你的流动性',
  'Create Liquidity': '创建流动性',
  'No Liquidity Found': '未发现流动性',
  Add: '添加',
  Reduce: '减少',
  Amount: '数量',
  'LP token/ratio': 'LP token/做市占比',
  Input: '输入',
  'Pool share': '预估资金池占比',
  'Intial Price': '初始价格',
  'Input Pool': '创建流动性池',
  Error: '错误',
  'Existed Pool': '当前资金池已存在, 请直接添加流动性 >',
  'Reduce Liquidity': '减少流动性',
  'Withdraw assets': '提取资产',
  All: '全部',
  Confirm: '确认',
  'Swap Pair': '交易对',
  Liquidity: '流动性',
  '24H Volume': '24H交易量',
  'Fee APY': '手续费年化',
  'Last Price': '价格',
  '24H Change': '24H涨跌幅',
  Action: '操作',
  Trade: '交易',
  'Advanced setting': '高级设置',
  'Set slippage tolerance': '设置滑点容忍度',
  'Your transaction may fail': '你的交易可能失败',
  'Transaction deadline': '交易截止时间',
  Minutes: '分钟',
  'Minimum received help':
    '如果交易确认之前出现了不利的大幅价格变动，您的交易将退回。',
  'Price Impact help': '受交易规模影响，市价与预期价格之间的差值。',
  'Liquidity Provider Fee help':
    '流动性提供者将获得每笔交易的 0.3% 作为协议奖励。',
  'pending transactions': '交易打包中',
  'transaction confirmed': '交易完成',
  'based on 24hr volume annualized': '手续费收益年化利率 (基于24小时交易量)',
  "Current pair can only swap through OKT, there's no direct pair for the 2 tokens.":
    '当前交易对只能通过OKT兑换，暂无可以直接兑换这两个币的资金池',
  'Your transaction will revert if the price changes unfavorably by more than this percentage.':
    '如果价格变动幅度超过此百分比，您的交易将退回。',
  "It's your current liquidity in the pool.": '这是你当前在资金池里的流动性',
  'The share of the pool liquidity after you add.': '你此次添加流动性的占比',
  'set confirmed': '设置成功',
  'pool empty': '当前池子为空，不能交易',
  'pool empty tip': '当前池中并无流动性，请添加第一笔流动性决定初始价格',
  'watchlist noData': '暂无数据',
  insufficient: '{coin}余额不足',
  'insufficient lp token': 'LP Token余额不足',
  'spot.asset.farm': 'Farm',
  seoFarmTitle: 'Decentralized trading platform FARM',
  Farm: 'Farm',
  Dashboard: 'Dashboard',
  'You haven’t connected a wallet.': 'You haven’t connected a wallet.',
  'White listed': 'White listed',
  'Total staked：': 'Total staked：',
  'Pool rate：': 'Pool rate：',
  STAKE: 'STAKE',
  UNSTAKE: 'UNSTAKE',
  'Start in': 'Start in',
  'Finish in': 'Finish in',
  d: 'd',
  h: 'h',
  m: 'm',
  s: 's',
  'Other pools': 'Other pools',
  'Farm pool': 'Farm pool',
  'Total staked': 'Total staked',
  'Pool rate(1Day)': 'Pool rate(1Day)',
  'Farm APY': 'Farm APY',
  'Start at': 'Start at',
  'Finish at': 'Finish at',
  'Search pool': 'Search pool',
  'Haven’t farmed yet': 'Haven’t farmed yet? Go stake and enjoy ',
  APY: ' APY!',
  'Go stake': 'Go stake',
  'Connect wallet to check your farming':
    'Connect wallet to check your farming',
  'Total staked LP / Pool ratio': 'Total staked LP / Pool ratio',
  'Will start in': 'Will start in',
  'Will finish in': 'Will finish in',
  'Total farmed / Farm APY': 'Total farmed(USD) / Farm APY',
  Token: 'Token',
  Claimed: 'Claimed',
  Unclaimed: 'Unclaimed',
  'Claim all': 'Claim all',
  Stake: 'Stake',
  Unstake: 'Unstake',
  Number: 'Number',
  'Avaliable to stake': 'Avaliable to stake: ',
  'Avaliable to unstake': 'Avaliable to unstake: ',
  'Pool ratio': 'Pool ratio',
  'FARM APY': 'FARM APY',
  'You didn’t have any LP tokens':
    'You didn’t have any LP tokens of {pool_name}, please go add liquidity first.',
  'Claim details': 'Claim details',
  '1Day':'1Day',
  'balance not enough':'balance not enough'
};
export default zhCN;
