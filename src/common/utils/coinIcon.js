import coinDefault from '_src/assets/images/icon_f2pool@2x.png';
import coinOkt from '_src/assets/images/okt.png';
import defaultcoin from '_src/assets/images/defaultcoin.png';
import coinEthk from '_src/assets/images/icon_ethk.png';
import coinLtck from '_src/assets/images/icon_ltck.png';
import BTCK from '_src/assets/images/BTCK.png';
import USDT from '_src/assets/images/USDT.png';
import DOTK from '_src/assets/images/DOTK.png';
import FILK from '_src/assets/images/FILK.png';
import USDC from '_src/assets/images/USDC.png';
import USDK from '_src/assets/images/USDK.png';
import OKB from '_src/assets/images/OKB.png';

const icons = {
  OKT: coinOkt,
  'BTCK-BA9': BTCK,
  'USDT-A2B': USDT,
  'ETHK-C63': coinEthk,
  'LTCK-5CB': coinLtck,
  'DOTK-4C0': DOTK,
  'FILK-2EE': FILK,
  'USDC-E6C': USDC,
  'USDK-956': USDK,
  'OKB-C4D': OKB,
};

export function getCoinIcon(symbol) {
  if (!symbol) return coinDefault;
  const temp = Object.keys(icons).filter(
    (d) => d.toLowerCase() === symbol.toLowerCase()
  );
  if (temp[0]) return icons[temp[0]];
  return defaultcoin;
}

export function getDisplaySymbol(symbol, filter = true) {
  if (!symbol) return symbol;
  const temp = Object.keys(icons).filter(
    (d) => d.toLowerCase() === symbol.toLowerCase()
  );
  if (temp[0] && filter) return temp[0].replace(/\-.*/, '').toUpperCase();
  return symbol.toUpperCase();
}
