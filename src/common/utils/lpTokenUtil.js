export function isLpToken(tokenPair) {
  let ammswap = /(ammswap_)/.test(tokenPair);
  if(!ammswap) return null;
  const tokens = tokenPair.split('_');
  return tokens;
}

export function getLpTokenInfo(tokenPair) {
  const tokens = isLpToken(tokenPair)
  if(!tokens) return null;
  const lptokens = [[],[]];
  let ammswapCount = 0;
  for(let index=0;index<tokens.length;index++) {
    const temp = tokens[index];
    if(temp === 'ammswap') {
      if(index !== 0) ammswapCount ++;
      if(ammswapCount > 1) break;
      continue;
    }
    if(lptokens[ammswapCount].length === 2) ammswapCount++;
    if(ammswapCount > 1) break;
    lptokens[ammswapCount].push(temp);
  }
  if(!lptokens[0].length && !lptokens[1].length) return null;
  return {
    base: lptokens[0],
    quote: lptokens[1],
    name: getLpTokenName(lptokens[0],lptokens[1])
  }

}

function getLpTokenName(base, quote, baseStr='', quoteStr='') {
  if(base.length === 1) baseStr = base[0].toUpperCase();
  else if(base.length === 2) baseStr = `LP (${base[0].toUpperCase()}/${base[1].toUpperCase()})`;
  if(quote.length === 1) quoteStr = quote[0].toUpperCase();
  else if(quote.length === 2) quoteStr = `LP (${quote[0].toUpperCase()}/${quote[1].toUpperCase()})`;
  if(!baseStr) return quoteStr;
  if(!quoteStr) return baseStr;
  return `${baseStr}/${quoteStr}`;
}
