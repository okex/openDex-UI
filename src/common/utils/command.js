export const getStartCommand = ({
  datadir,
  db,
  p2p,
  rest = '26659',
  ws = '26661',
  rpc = '26657',
}) =>
  `./okexchaind start --home ${datadir} --backend.enable_backend 1 --backend.enable_mkt_compute 1 --backend.orm_engine.engine_type sqlite3 --backend.orm_engine.connect_str ${db} --rest.laddr  tcp://0.0.0.0:${rest} --p2p.laddr tcp://0.0.0.0:${p2p} --rpc.laddr tcp://0.0.0.0:${rpc} --stream.engine "websocket|websocket|0.0.0.0:${ws}" --stream.local_lock_dir ${datadir}/data/local_lock --stream.worker_id desktop`;
