export default {
  DEX: {
    PROD: 'wss://dexcomreal.bafang.com:8443/ws/v3',
    QA: 'ws://real.okex.com:10442/ws/v3?_compress=false',
    SVC:
      'ws://okcoin-push-decentralization.test-b-okex.svc.test.local:10442/ws/v3?compress=true',
    DEV:
      'ws://okcoin-push-decentralization.dev-okex.svc.cluster.local:10442/ws/v3?_compress=false',
  },
  DEV:
    'ws://okcoin-push-decentralization.dev-okex.svc.cluster.local:10442/ws/v3?_compress=false',
  LOCAL:
    'ws://okcoin-push-decentralization.dev-okex.svc.cluster.local:10442/ws/v3?_compress=false',
};
