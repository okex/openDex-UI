

export function isLpToken(tokenPair) {
  let ammswap = /(ammswap_)/.test(tokenPair);
  if(!ammswap) return null;
  tokenPair = tokenPair.replace(/(ammswap_)/,'');
  const tokens = tokenPair.split('_');
  return tokens.length === 2 ? tokens : null;
}

export function getLpTokenInfo(tokenPair) {
  const tokens = isLpToken(tokenPair)
  if(!tokens) return null;
  return {
    base: tokens[0],
    quote: tokens[1],
    name: `LP (${tokens[0].toUpperCase()}/${tokens[1].toUpperCase()})`
  }
}