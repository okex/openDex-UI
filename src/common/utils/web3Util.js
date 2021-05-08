import Web3 from 'web3';
import { wallet } from '@okexchain/javascript-sdk';
import { calc } from '_component/okit';
import env from '../constants/env';

const web3 = new Web3();
const abi = [
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
web3.setProvider(new Web3.providers.HttpProvider(env.envConfig.web3Provider));

export default {
  async getBalance(
    contractAddress,
    balanceAddress = window.OK_GLOBAL.generalAddr
  ) {
    const tokenContract = new web3.eth.Contract(abi, contractAddress);
    const decimals = await tokenContract.methods.decimals().call();
    const balance = await tokenContract.methods
      .balanceOf(balanceAddress)
      .call();
    return calc.div(balance, 10 ** decimals);
  },
  async transfer({
    contractAddress,
    fromAddress = window.OK_GLOBAL.generalAddr,
    toAddress,
    privateKey,
    amount,
  }) {
    const tokenContract = new web3.eth.Contract(abi, contractAddress);
    const decimals = await tokenContract.methods.decimals().call();
    const currAmount = web3.utils.toBN(calc.mul(amount, 10 ** decimals));
    let nonce = await web3.eth.getTransactionCount(fromAddress);
    let gasPrice = await web3.eth.getGasPrice();
    let tokenData = await tokenContract.methods
      .transfer(toAddress, currAmount)
      .encodeABI();
    let rawTx = {
      nonce,
      gasPrice,
      to: tokenContract.options.address,
      from: fromAddress,
      data: tokenData,
    };
    let gas = await web3.eth.estimateGas(rawTx);
    rawTx.gas = gas;
    let signedTx;
    if (privateKey)
      signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey);
    else signedTx = await wallet.sign4Token(rawTx);
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  },
  async contract(contractAddress) {
    const validity = web3.utils.isAddress(contractAddress);
    if (!validity) return null;
    const valid = await this.validate0xAddress(contractAddress);
    if (valid === 'err') return 'err';
    if (!valid) return { contractAddress, symbol: null, decimals: null };
    const tokenContract = new web3.eth.Contract(abi, contractAddress);
    const symbol = await this._methodCall(tokenContract, 'symbol');
    const decimals = await this._methodCall(tokenContract, 'decimals');
    return { contractAddress, symbol, decimals };
  },
  async _methodCall(tokenContract, method) {
    let result;
    try {
      result = await tokenContract.methods[method]().call();
    } catch {
      result = '';
    }
    return result;
  },
  async validate0xAddress(contractAddress) {
    let valid = false;
    try {
      const code = await web3.eth.getCode(contractAddress);
      valid = !!(code && code !== '0x');
    } catch {
      valid = 'err';
    }
    return valid;
  },
};
