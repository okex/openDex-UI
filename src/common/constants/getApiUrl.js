import { storage } from '_component/okit';

export const DEFAULT = window.okGlobal.mainDomain || 'https://www.okex.com';

export function getApiUrl(apiUrl = DEFAULT) {
  const protocol = window.location.protocol;
  if (/file/.test(protocol) || window.location.hostname === '127.0.0.1')
    return apiUrl;
  return `${window.location.protocol}//${window.location.host}`;
}

export function getCurrentApiUrl() {
  let url = getApiUrl();
  const currentNode = storage.get('currentNode');
  if (currentNode && currentNode.httpUrl) url = currentNode.httpUrl;
  return url;
}
