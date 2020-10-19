import { storage } from '_component/okit';
const currentNode = storage.get('currentNode');
let apiUrl = 'https://www.okex.com';
if(currentNode) apiUrl = currentNode.httpUrl || apiUrl;
const APIURL = apiUrl;

export default function (apiUrl = APIURL) {
  const protocol = window.location.protocol;
  if (/file/.test(protocol) || window.location.hostname === '127.0.0.1')
    return apiUrl;
  return `${window.location.protocol}//${window.location.host}`;
}
