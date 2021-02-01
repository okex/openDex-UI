import env from './env';
export default {
  DEX: {
    get PROD() {
      if (env.envConfig.isTest) return 'wss://dexcomreal.bafang.com:8443/ws/v3';
      if (window.okGlobal.ipRegion === 'CN')
        return 'wss://wsdex.coinall.ltd:8443/ws/v3';
      return 'wss://wsdex.okex.com:8443/ws/v3';
    },
    QA: 'ws://real.okex.com:10442/ws/v3?_compress=false',
    SVC:
      'ws://okcoin-push-decentralization.test-b-okex.svc.test.local:10442/ws/v3',
    DEV:
      'ws://okcoin-push-decentralization.dev-okex.svc.cluster.local:10442/ws/v3?_compress=false',
  },
  DEV:
    'ws://okcoin-push-decentralization.dev-okex.svc.cluster.local:10442/ws/v3?_compress=false',
  LOCAL:
    'ws://okcoin-push-decentralization.dev-okex.svc.cluster.local:10442/ws/v3?_compress=false',
};
