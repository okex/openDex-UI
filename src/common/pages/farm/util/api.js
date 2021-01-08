import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import util from '_src/utils/util';
import calc from '_src/utils/calc';
import { toLocale } from '_src/locale/react-locale';

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
  if(Array.isArray(data)) {
    data.forEach(d => {
      let total_apy = 0, farm_apy = [], pool_rate = [];
      d.pool_name_dis = d.pool_name.toUpperCase();
      d.lock_symbol_dis = d.lock_symbol.toUpperCase();
      d.yield_symbol_dis = d.yield_symbol.toUpperCase();
      d.farm_apy.forEach(dd => {
        total_apy = calc.add(total_apy,dd.amount);
        dd.denom_dis = dd.denom.toUpperCase();
        farm_apy.push(`${util.precisionInput(calc.mul(dd.amount, 100),2)}%${dd.denom_dis}`);
      })
      d.total_apy = util.precisionInput(calc.mul(total_apy, 100),2) + '%';
      d.farm_apy_dis = farm_apy.join('+');
      d.pool_rate.forEach(dd => {
        dd.denom_dis = dd.denom.toUpperCase();
        pool_rate.push(`${util.precisionInput(calc.mul(dd.amount,1),2)} ${dd.denom_dis}`);
      });
      d.pool_rate_dis = pool_rate.join('+');
      d.poolEmpty = false;
      d.total_staked_dis = Number(d.total_staked) === 0 ? '--' : '$'+util.precisionInput(calc.mul(d.total_staked,1),2);
      d.pool_ratio_dis = util.precisionInput(calc.mul(d.pool_ratio, 100),2) + '%';
      d.start_at_dis = calc.mul(d.start_at, 1000);
      d.finish_at_dis = calc.mul(d.finish_at, 1000);
      d.farmed_details && d.farmed_details.forEach(d => {
        d.symbol_dis = d.symbol.toUpperCase();
        d.claimed_dis = util.precisionInput(calc.mul(d.claimed, 1),8);
        d.unclaimed_dis = util.precisionInput(calc.mul(d.unclaimed, 1),8);
      });
      _proccessTimer(d);
    });
  }
}

function _proccessTimer(data) {
  const now = (Date.now() / 1000).toFixed();
  const start = calc.sub(data.start_at, now);
  const end = calc.sub(data.finish_at, now);
  if(start <=0 && end >= 0) {
    data.active = 1;
    data.timeInfo = _getTimerByCount(end);
  } else if(start > 0) {
    data.active = 2;
    data.timeInfo = _getTimerByCount(start);
  } else {
    data.active = 0;
    data.timeInfo = _getTimerByCount();
  }
}

function _getTimerByCount(count=0) {
  let d = 0,h=0,m=0,s=0;
  if(count > 0) {
    d = parseInt(count / (24*3600), 10);
    h = parseInt(count / 3600, 10);
    m = parseInt((count % 3600) / 60, 10);
    s = count % 60;
  }
  const d_dis = d > 0 ? (d >= 10 ? d + '' : '0' + d) : '00';
  const h_dis = h > 0 ? (h >= 10 ? h + '' : '0' + h) : '00';
  const m_dis = m > 0 ? (m >= 10 ? m + '' : '0' + m) : '00';
  const s_dis = s > 0 ? (s >= 10 ? s + '' : '0' + s) : '00';
  return `${d_dis}${toLocale('d')} ${h_dis}${toLocale('h')} ${m_dis}${toLocale('m')} ${s_dis}${toLocale('s')}`
}

//@mock let mocker = require('./mock');
export function whitelist() {
  //@mock mocker.whitelist(URL.GET_FARM_POOLS_WHITELIST);
  return get(URL.GET_FARM_POOLS_WHITELIST).then(data => {
    _proccessData(data.data);
    return data;
  });
}

export function normal() {
  //@mock mocker.normal(URL.GET_FARM_POOLS_NORMAL);
  return get(URL.GET_FARM_POOLS_NORMAL).then(data => {
    _proccessData(data.data);
    return data;
  });
}

export function dashboard(param={}) {
  const address = util.getMyAddr();
  //@mock mocker.dashboard(`${URL.GET_FARM_DASHBOARD}/${address}`);
  return get(`${URL.GET_FARM_DASHBOARD}/${address}`,param).then(data => {
    _proccessData(data.data);
    return data;
  });;
}

export function maxApy() {
  //@mock mocker.maxAPY(`${URL.GET_FARM_MAX_APY}`);
  return get(`${URL.GET_FARM_MAX_APY}`).then(data => {
    return {
      data_dis: util.precisionInput(calc.mul(data, 100),2) + '%',
      data
    }
  });
}

export function stakedInfo({poolName}) {
  //@mock mocker.stakedInfo(`${URL.GET_FARM_STAKED_INFO.replace('{poolName}',poolName)}`);
  return get(`${URL.GET_FARM_STAKED_INFO.replace('{poolName}',poolName)}`).then(data => {
    data.pool_name_dis = data.pool_name.toUpperCase();
    data.balance_dis = util.precisionInput(data.balance,8);
    data.account_staked = util.precisionInput(data.account_staked,8);
    data.pool_total_staked_dis = util.precisionInput(data.pool_total_staked,8);
    data.pool_ratio_dis = util.precisionInput(data.pool_ratio,2);
    return data;
  });
}

export function process(data) {
  if(Array.isArray(data)) {
    data.forEach(d => _proccessTimer(d));
  }
}