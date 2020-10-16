export default function (apiUrl = 'http://10.0.66.18:26659') {
  const protocol = window.location.protocol;
  if (/file/.test(protocol) || window.location.hostname === '127.0.0.1')
    return apiUrl;
  return `${window.location.protocol}//${window.location.host}`;
}
