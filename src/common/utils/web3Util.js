import Web3 from 'web3';
import { wallet } from '@okexchain/javascript-sdk';
import env from '../constants/env';
const web3 = new Web3();
const abi = [
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
web3.setProvider(new Web3.providers.HttpProvider(env.envConfig.web3Provider));// 26659"https://18.166.60.86:26659"

export default {
    async getBalance (contractAddress, balanceAddress = window.OK_GLOBAL.generalAddr) {
        const tokenContract = new web3.eth.Contract(abi, contractAddress);
        // 获取ERC20代币余额
        return await tokenContract.methods.balanceOf(balanceAddress).call();    
    },
    async transfer ({
        contractAddress,
        fromAddress=window.OK_GLOBAL.generalAddr,
        toAddress,
        privateKey,
        amount
    }) {
        const tokenContract = new web3.eth.Contract(abi, contractAddress);
        amount = web3.utils.toBN("1000");
        let nonce = await web3.eth.getTransactionCount(fromAddress);
        let gasPrice = await web3.eth.getGasPrice();
        let tokenData = await tokenContract.methods.transfer(toAddress, amount).encodeABI();
        let rawTx = {
            nonce: nonce,
            gasPrice: gasPrice,
            to: tokenContract.options.address,
            from: fromAddress,
            data: tokenData
        }
        let gas = await web3.eth.estimateGas(rawTx);
        rawTx.gas = gas;
        let signedTx;
        if(privateKey) signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey);
        else signedTx = await wallet.sign(rawTx);
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    },
    async contract(contractAddress) {
        const valid = await this.validate0xAddress(contractAddress);
        if(!valid) return null;
        const tokenContract = new web3.eth.Contract(abi, contractAddress);
        const symbol = await this._methodCall(tokenContract, 'symbol');
        const decimals = await this._methodCall(tokenContract, 'decimals');
        return {contractAddress, symbol, decimals}
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
        const validity = web3.utils.checkAddressChecksum(contractAddress);
        if(validity) {
            try {
                const code = await web3.eth.getCode(contractAddress);
                valid = !!(code && code !== '0x');
            } catch {
                valid = false;
            }
        }
        return valid;
    }
}
const worker = async () => {
    
    const contractAddress = "0xa3EbA3F054f1b52A9294bbD69ecEd053bbadD719";
    const tokenContract = new web3.eth.Contract(abi, contractAddress);  

    // 获取ERC20代币余额
    const balanceAddress = "0x6aDE42D1904875eE923ca0231048800D162f4823";
    let balance
    try {
        balance = await tokenContract.methods.balanceOf(balanceAddress).call();    
    } catch (error) {
        console.log(error)
    }
    
    console.log(balance)

    // ERC20代币转账
    const fromAddress = "0x6aDE42D1904875eE923ca0231048800D162f4823";
    const toAddress = "0xc436b3E2856a270D597bdDD2a23Bb17A31E8797F";
    const privateKey = "0x855c5643437edfdaed729b39826fe2032d5f13ce5f69d565d7af864d6013320e";
    const amount = web3.utils.toBN("1000000000000000000000");
    try {
        let nonce = await web3.eth.getTransactionCount(fromAddress);
        let gasPrice = await web3.eth.getGasPrice();
        if (amount > balance) {
            console.log("余额不足");
        }
        let tokenData = await tokenContract.methods.transfer(toAddress, amount).encodeABI();

        let rawTx = {
            nonce: nonce,
            gasPrice: gasPrice,
            to: tokenContract.options.address,
            from: fromAddress,
            data: tokenData
        }
        let gas = await web3.eth.estimateGas(rawTx);
        rawTx.gas = gas;
        let signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey);
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (err) {
        console.log(err);
    }

}

// worker()