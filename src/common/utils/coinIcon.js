import coinDefault from '_src/assets/images/icon_f2pool@2x.png';
import coinOkt from '_src/assets/images/icon_usdt@2x.png';
import defaultcoin from '_src/assets/images/defaultcoin.png';
import coinEthk from '_src/assets/images/icon_ethk.png';
import coinLtck from '_src/assets/images/icon_ltck.png';

const icons = {
  OKT: coinOkt,
  'BTCK-BA9': '//static.coinall.ltd/cdn/assets/imgs/2012/BE4B2476FC222ECB.png?x-oss-process=image/format,webp',
  'USDT-A2B': '//static.coinall.ltd/cdn/assets/imgs/2011/6C04D5C74FCC0D3D.png',
  'ETHK-C63': coinEthk,
  'LTCK-5CB': coinLtck,
  'DOTK-4C0': '//static.coinall.ltd/cdn/assets/imgs/2012/1F10D45986407FF1.png',
  'FILK-2EE': '//static.coinall.ltd/cdn/assets/imgs/2012/2895A447B916043F.png',
  'USDC-E6C': '//static.coinall.ltd/cdn/assets/imgs/2011/635D4664F3F1C5E7.png',
  'USDK-956': '//static.coinall.ltd/cdn/assets/imgs/2011/3405CB273D823CB6.png',
  'OKB-C4D': '//static.coinall.ltd/cdn/assets/imgs/2011/D1CF44F8F575D0C8.png'
};

export function getCoinIcon(symbol) {
  if (!symbol) return coinDefault;
  const temp = Object.keys(icons).filter(
    (d) => d.toLowerCase() === symbol.toLowerCase()
  );
  if (temp[0]) return icons[temp[0]];
  return defaultcoin;
}

export function getDisplaySymbol(symbol) {
  if (!symbol) return symbol;
  const temp = Object.keys(icons).filter(
    (d) => d.toLowerCase() === symbol.toLowerCase()
  );
  if (temp[0]) return temp[0].replace(/\-.*/,'').toUpperCase();
  return symbol.toUpperCase();
}
