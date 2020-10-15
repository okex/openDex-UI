import coinDefault from '_src/assets/images/icon_f2pool@2x.png';
import coinOkt from '_src/assets/images/icon_usdt@2x.png';

const icons = {
  'OKT':coinOkt,
  'TOKT':coinOkt
}

export function getCoinIcon(symbol) {
  if(!symbol) return coinDefault;
  const temp = Object.keys(icons).filter(d => d.toLowerCase() === symbol.toLowerCase());
  if(temp[0]) return icons[temp[0]];
  return coinOkt;
}