const axios = require('axios');
var Web3 = require("web3");
var Contract = require('web3-eth-contract');
var Tx = require("ethereumjs-tx").Transaction;
var fs = require('fs');

const addr = "0x9948cF6323C5A41Bf673ADb9CFDf9D39a65A86e1";
const privKey = Buffer.from(
  "c10db65a8acf95ba32484914decab849bc838e4d3ba1269a2b6f7d23bed50f5b",
  "hex"
);
const wsProvider = "wss://eth-goerli.ws.alchemyapi.io/v2/-DmgmQjRZLHQDlLMHZaLSHr1hPRTJAIC";
const gopCreatorAddress = "0xF7D19476D8b8edA9F2076bce42EA56CA98b978bC";
const utils = require('web3-utils');
const horseCode = "FPYG0LHv5MA"; // Horse name is Under Immense Pressure
const horsePrice = "1577430129704192";
const getBytes32 = (data) => utils.fromAscii(data);
const getHex = (data) => utils.toHex(data);
const getChecksumAddress = (data) => utils.toChecksumAddress(data);
const getEthFromWei = (wei, unit = 'ether') => {
    return utils.fromWei(String(wei), unit)
};
const getWeiFromEth = (eth, unit = 'ether') => utils.toWei(eth, unit);

const checkSumAddress = getChecksumAddress(addr);

console.log(">>>> Checksum address: ", checkSumAddress);
const DEFAULT_GAS_PRICE = 10;
const DEFAULT_GAS_LIMIT = 50000;

var data = fs.readFileSync('GOPCreator.json', 'utf8');
var jsonInterface = JSON.parse(data);

let gasPrice = DEFAULT_GAS_PRICE, gas;

Contract.setProvider(wsProvider);

var contract = new Contract(jsonInterface.abi, gopCreatorAddress);
var value = getHex(horsePrice);

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    wsProvider,
    {
      reconnect: {
        auto: true,
        delay: 1000, // ms
        maxAttempts: 10,
      },
    }
  )
);

const queryGasPrice = () => {
    return axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    .then((res) => {
      gasPrice = Number(res.data.average) / 10
      console.log('gasPrice:', gasPrice)
    })
    .catch((err) => {console.log(err)});
}

queryGasPrice();

const getRecommendedGasPrice = () => {
    return gasPrice;
}

const method = contract.methods.receiveGOPFunds(getBytes32(horseCode));
const methodEncodedABI = contract.methods.receiveGOPFunds(getBytes32(horseCode)).encodeABI();


const getRecommendedGasValues = async (data, to, from, value = '0') => {
    console.log(">>> From : " , from);
    value = getHex(value)
    const estimatedGas = web3.eth.estimateGas({data, to: to, from: from, value }).catch(async (err) => {
      if (err.code === -32000 && err.message.indexOf('insufficient funds') !== -1) {
        return DEFAULT_GAS_LIMIT
      } else {
        return null
      }
    });
    const recommendedFee = getRecommendedGasPrice();
    [gas, gasPrice] = await Promise.all([estimatedGas, recommendedFee]);
    // To avoid `out of gas` error while estimating gas because of pending transactions
    gas = gas ? gas + DEFAULT_GAS_LIMIT : 0
    gasPrice = getWeiFromEth(String(gasPrice), 'gwei')
    const gasInEth = Number(getEthFromWei(String(gas * Number(gasPrice))))
    return {
      gas,
      gasPrice,
      gasInEth,
    }
  }

new Promise((resolve, reject) => {
    getRecommendedGasValues(methodEncodedABI, gopCreatorAddress, checkSumAddress, horsePrice)
      .then(({ gas, gasPrice }) => {
        method
          .send({
            from,
            gas,
            gasPrice,
            value,
          })
          .on('transactionHash', resolve)
          .on('error', reject)
      })
      .catch(reject)
});