import { crypto } from '@okexchain/javascript-sdk';

export default function addressConversion (addr) {
  return crypto.convertBech32ToHex(addr)[0]
}