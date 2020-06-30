import React from 'react';
import Loadable from 'react-loadable';
import Loading from '_component/Loading';
import { toLocale } from '_src/locale/react-locale';
import Alert from '_src/component/Alert';
import './index.less';


const delay = 250;
const timeout = 20000;
function loading(props) {
  let loadingPart = null;
  if (props.error || props.timedOut) {
    loadingPart = (
      <div className="err-while-loading">
        <Alert
          type={Alert.TYPE.error}
          message={
            <div>
              <span>{ toLocale(props.error ? 'spot.error' : 'spot.timeout') }! </span>
              <a onClick={() => { window.location.reload(); }} >{ toLocale('spot.retry') }</a>
            </div>
          }
          closable={false}
        />
      </div>

    );
  } else if (props.pastDelay) {
    loadingPart = <div className="loading-container"><Loading when={1} /></div>;
  }
  return loadingPart;
}
export default (loader, showLoading = true) => {
  return Loadable({
    loader,
    delay,
    timeout,
    loading: (showLoading ? loading : () => { return null; }), // 默认不显示loading
  });
};
