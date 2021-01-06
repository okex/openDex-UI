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
        farm_apy.push(`${calc.mul(dd.amount, 100).toFixed(2)}%${dd.denom_dis}`);
      })
      d.total_apy = calc.mul(total_apy, 100).toFixed(2) + '%';
      d.farm_apy_dis = farm_apy.join('+');
      d.pool_rate.forEach(dd => {
        dd.denom_dis = dd.denom.toUpperCase();
        pool_rate.push(`${calc.mul(dd.amount,1).toFixed(2)} ${dd.denom_dis}`);
      });
      d.pool_rate_dis = pool_rate.join('+');
      d.total_staked_dis = Number(d.total_staked) === 0 ? '--' : '$'+calc.mul(d.total_staked,1).toFixed(2);
      d.pool_ratio_dis = calc.mul(d.pool_ratio, 100).toFixed(2) + '%';
      d.farmed_details.forEach(d => {
        d.symbol_dis = d.symbol.toUpperCase();
        d.claimed_dis = calc.mul(d.claimed, 1).toFixed(8);
        d.unclaimed_dis = calc.mul(d.unclaimed, 1).toFixed(8);
      })
    });
  }
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