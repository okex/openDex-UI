import { getDisplaySymbol } from './coinIcon';

export function isLpToken(tokenPair) {
  if(!tokenPair) return null;
  tokenPair = tokenPair.toLowerCase();
  let ammswap = /(ammswap_)/.test(tokenPair);
  if (!ammswap) return null;
  const tokens = tokenPair.split('_');
  if (tokens.filter((d) => d === 'ammswap').length > 2) return null;
  return tokens;
}

export function getLpTokenInfo(tokenPair,filter=true) {
  tokenPair = tokenPair.toLowerCase();
  const tokens = isLpToken(tokenPair);
  if (!tokens) return null;
  const lptokens = [[], []];
  let ammswapCount = 0;
  for (let index = 0; index < tokens.length; index++) {
    const temp = tokens[index];
    if (temp === 'ammswap') {
      if (index !== 0) ammswapCount++;
      if (ammswapCount > 1) break;
      continue;
    }
    if (lptokens[ammswapCount].length === 2) ammswapCount++;
    if (ammswapCount > 1) break;
    lptokens[ammswapCount].push(temp);
  }
  if (!lptokens[0].length && !lptokens[1].length) return null;
  return {
    base: lptokens[0],
    quote: lptokens[1],
    name: getLpTokenName(lptokens[0], lptokens[1], '', '' ,filter),
  };
}

export function getLpTokenStr(tokenPair = '', filter=true) {
  tokenPair = tokenPair.toLowerCase();
  const lpTokenInfo = getLpTokenInfo(tokenPair, filter);
  if (lpTokenInfo) return lpTokenInfo.name;
  if (/(ammswap_)/.test(tokenPair)) return tokenPair.toUpperCase();
  return getDisplaySymbol(tokenPair, filter);
}

function getLpTokenName(base, quote, baseStr = '', quoteStr = '', filter=true) {
  if (base.length === 1) baseStr = getDisplaySymbol(base[0], filter);
  else if (base.length === 2)
    baseStr = `LP (${getDisplaySymbol(base[0], filter)}/${getDisplaySymbol(base[1], filter)})`;
  if (quote.length === 1) quoteStr = quote[0].toUpperCase();
  else if (quote.length === 2)
    quoteStr = `LP (${getDisplaySymbol(quote[0], filter)}/${getDisplaySymbol(
      quote[1], filter
    )})`;
  if (!baseStr) return quoteStr;
  if (!quoteStr) return baseStr;
  return `${baseStr}/${quoteStr}`;
}
