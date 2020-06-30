export default {
  DEX: {
    PROD: 'wss://dexcomreal.bafang.com:8443/ws/v3', // 线上环境 ?_compress=false
    QA: 'ws://real.okex.com:10442/ws/v3?_compress=false', // 测试环境
    SVC: 'ws://okcoin-push.{server}.svc.test.local:10442/ws/v3?_compress=false', // SVC测试环境
    DEV: 'ws://okcoin-push-decentralization.dev-okex.svc.cluster.local:10442/ws/v3?_compress=false', // 集成开发环境
  },
  DEV: 'ws://okcoin-push-decentralization.dev-okex.svc.cluster.local:10442/ws/v3?_compress=false', // 集成开发环境
  LOCAL: 'ws://okcoin-push-decentralization.dev-okex.svc.cluster.local:10442/ws/v3?_compress=false', // 'ws://real.okex.com:10442/ws/v3?_compress=false', // 本地开发环境
};
