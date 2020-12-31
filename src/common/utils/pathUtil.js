export function getPathAndHash() {
  let { pathname, hash } = window.location;
  pathname = pathname.replace(/\/*$/, '');
  hash = hash.replace(/\/*$/, '').replace(/^#/, '');
  return {pathname,hash};
}