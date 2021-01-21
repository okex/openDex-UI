import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import util from '_src/utils/util';
import calc from '_src/utils/calc';
import { getLpTokenInfo, getLpTokenStr } from '_src/utils/lpTokenUtil';
import { toLocale } from '_src/locale/react-locale';
import env from '../../../constants/env';

const firstPoolConf = env.envConfig.firstPoolConf;

function ajax(method, url, params) {
  return ont[method](url, params || undefined).then((data) => {
    if (data.code === 0) return data.data;
    else throw new Error(toLocale(`error.code.${data.code}`) || data.msg);
  });
}

function get(url, params = {}) {
  const method = 'get';
  return ajax(method, url, { params });
}

function _proccessData(data) {
  if (Array.isArray(data)) {
    data.forEach((d) => {
      let total_apy = 0,
        farm_apy = [],
        pool_rate = [];
      d.pool_name_dis = getLpTokenStr(d.pool_name);
      d.lock_symbol_dis = getLpTokenStr(d.lock_symbol);
      d.yield_symbol_dis = getLpTokenStr(d.yield_symbol);
      d.lock_symbol_info = _getLockSymbolInfos(d.lock_symbol);
      d.isLpToken = d.lock_symbol_info.symbols.length > 1;
      d.farm_apy.forEach((dd) => {
        total_apy = calc.add(total_apy, dd.amount);
        dd.denom_dis = getLpTokenStr(dd.denom);
        farm_apy.push(
          `${util.precisionInput(calc.mul(dd.amount, 100), 2)}%${dd.denom_dis}`
        );
      });
      d.total_apy = util.precisionInput(calc.mul(total_apy, 100), 2) + '%';
      d.total_apy_4 = util.precisionInput(calc.mul(total_apy, 100), 4) + '%';
      d.farm_apy_dis = farm_apy.join('+');
      d.pool_rate.forEach((dd) => {
        dd.denom_dis = getLpTokenStr(dd.denom);
        pool_rate.push(`${util.precisionInput(dd.amount, 2)} ${dd.denom_dis}`);
      });
      d.pool_rate_dis = pool_rate.join('+');
      d.poolEmpty = d.status === 1;
      d.total_staked_dis =
        Number(d.total_staked) === 0
          ? '--'
          : '$' + calc.thousandFormat(util.precisionInput(d.total_staked, 2));
      d.total_staked_dashbord_dis =
        Number(d.total_staked) === 0
          ? '--'
          : util.precisionInput(d.total_staked, 8);
      d.pool_ratio_dis =
        util.precisionInput(calc.mul(d.pool_ratio, 100), 2) + '%';
      d.pool_ratio_dis_4 =
        util.precisionInput(calc.mul(d.pool_ratio, 100), 4) + '%';
      d.start_at_dis = calc.mul(d.start_at, 1000);
      d.finish_at_dis = calc.mul(d.finish_at, 1000);
      d.total_farmed_dis = util.precisionInput(d.total_farmed, 2);
      !d.farmed_details && (d.farmed_details = []);
      d.farmed_details &&
        d.farmed_details.forEach((d) => {
          d.symbol_dis = getLpTokenStr(d.symbol);
          d.claimed_dis = util.precisionInput(d.claimed, 8);
          d.unclaimed_dis = util.precisionInput(d.unclaimed, 8);
        });
      _proccessTimer(d);
    });
  }
}

function _proccessTimer(data) {
  const now = (Date.now() / 1000).toFixed();
  const start = calc.sub(data.start_at, now);
  const end = calc.sub(data.finish_at, now);
  if (start <= 0 && end >= 0) {
    data.active = 1;
    data.timeInfo = _getTimerByCount(end);
  } else if (start > 0) {
    data.active = 2;
    data.timeInfo = _getTimerByCount(start);
  } else {
    data.active = 0;
    data.timeInfo = _getTimerByCount();
  }
}

function _proccessTimer4First(data) {
  const now = (Date.now() / 1000).toFixed();
  const start = calc.sub(data.claim_at, now);
  if (start > 0) {
    data.active = 0;
    data.timeInfo = _getTimerByCount(start);
  } else {
    data.active = 1;
    data.timeInfo = _getTimerByCount();
  }
}

function _getTimerByCount(count = 0) {
  let d = 0,
    d_mod = 0,
    h = 0,
    h_mod = 0,
    m = 0,
    s = 0;
  if (count > 0) {
    d = parseInt(count / (24 * 3600), 10);
    d_mod = count % (24 * 3600);
    h = parseInt(d_mod / 3600, 10);
    h_mod = d_mod % 3600;
    m = parseInt(h_mod / 60, 10);
    s = h_mod % 60;
  }
  const d_dis = d > 0 ? (d >= 10 ? d + '' : '0' + d) : '00';
  const h_dis = h > 0 ? (h >= 10 ? h + '' : '0' + h) : '00';
  const m_dis = m > 0 ? (m >= 10 ? m + '' : '0' + m) : '00';
  const s_dis = s > 0 ? (s >= 10 ? s + '' : '0' + s) : '00';
  return `${d_dis}${toLocale('d')} ${h_dis}${toLocale('h')} ${m_dis}${toLocale(
    'm'
  )} ${s_dis}${toLocale('s')}`;
}

function _getLockSymbolInfos(lock_symbol) {
  const lpToken = getLpTokenInfo(lock_symbol);
  const result = { symbols: [], name: '' };
  if (lpToken) {
    result.symbols = lpToken.base;
    result.name = lpToken.name;
  } else {
    result.symbols.push(lock_symbol);
    result.name = getLpTokenStr(lock_symbol);
  }
  return result;
}

//@mock let mocker = require('./mock');
export function whitelist() {
  //@mock mocker.whitelist(URL.GET_FARM_POOLS_WHITELIST);
  return get(URL.GET_FARM_POOLS_WHITELIST).then((data) => {
    if(!Array.isArray(data.data)) data.data = [];
    _proccessData(data.data);
    return data;
  });
}

export function normal(param = {}) {
  //@mock mocker.normal(URL.GET_FARM_POOLS_NORMAL);
  return get(URL.GET_FARM_POOLS_NORMAL, param).then((data) => {
    if(!Array.isArray(data.data)) data.data = [];
    data.data = data.data.filter((d) => {
      const need = d.in_whitelist || d.pool_name !== firstPoolConf.pool_name;
      if (!need) data.param_page.total = data.param_page.total - 1;
      return need;
    });
    _proccessData(data.data);
    return data;
  });
}

export function dashboard(param = {}) {
  const address = util.getMyAddr();
  //@mock mocker.dashboard(`${URL.GET_FARM_DASHBOARD}/${address}`);
  return get(`${URL.GET_FARM_DASHBOARD}/${address}`, param).then((data) => {
    if(!Array.isArray(data.data)) data.data = [];
    data.data = data.data.filter((d) => {
      const need = d.in_whitelist || d.pool_name !== firstPoolConf.pool_name;
      if (!need) {
        data.param_page.total = data.param_page.total - 1;
        data.hasFirstPool = true;
      }
      return need;
    });
    _proccessData(data.data);
    return data;
  });
}

export function maxApy() {
  //@mock mocker.maxAPY(`${URL.GET_FARM_MAX_APY}`);
  return get(`${URL.GET_FARM_MAX_APY}`).then((data) => {
    return {
      data_dis: Number(data)
        ? util.precisionInput(calc.mul(data, 100), 2) + '%'
        : '300.00%',
      data,
    };
  });
}

export function stakedInfo({ poolName }) {
  //@mock mocker.stakedInfo(`${URL.GET_FARM_STAKED_INFO.replace('{poolName}',poolName)}`);
  const address = util.getMyAddr();
  return get(`${URL.GET_FARM_STAKED_INFO.replace('{poolName}', poolName)}`, {
    address,
  }).then((data) => {
    data.pool_name_dis = getLpTokenStr(data.pool_name);
    data.balance_dis = util.precisionInput(data.balance, 8);
    data.account_staked = util.precisionInput(data.account_staked, 8);
    data.pool_total_staked_dis = util.precisionInput(data.pool_total_staked, 8);
    return data;
  });
}

export function first(params = {}) {
  //@mock mocker.first(URL.GET_FARM_FIRST);
  const address = util.getMyAddr();
  params.stake_at = firstPoolConf.stake_at;
  params.pool_name = firstPoolConf.pool_name;
  params.claim_height = calc.add(
    firstPoolConf.claim_height,
    firstPoolConf.claim_height_extra
  );
  if (address) params.address = address;
  return get(URL.GET_FARM_FIRST, params).then((data) => {
    data.claim_at = firstPoolConf.claim_at;
    processFirst(data);
    return data;
  });
}

export function processFirst(data) {
  data.lock_symbol = firstPoolConf.lock_symbol;
  data.lock_symbol_info = _getLockSymbolInfos(data.lock_symbol);
  data.pool_name = firstPoolConf.pool_name;
  data.isLpToken = data.lock_symbol_info.symbols.length > 1;
  data.pool_name_dis = data.lock_symbol_info.name;
  data.farm_apy_dis =
    util.precisionInput(calc.mul(data.farm_apy, 100), 2) + '%';
  data.farm_amount_dis = util.precisionInput(data.farm_amount, 8);
  data.total_staked_dis = '$' + util.precisionInput(data.total_staked, 8);
  _proccessTimer4First(data);
  data.account_staked_dis = util.precisionInput(data.account_staked, 8);
  data.estimated_farm_dis = util.precisionInput(data.estimated_farm, 8);
}

export function process(data) {
  if (Array.isArray(data)) {
    data.forEach((d) => _proccessTimer(d));
  }
}
