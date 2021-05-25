const csv = require("csvtojson");
const addr = "0x9948cF6323C5A41Bf673ADb9CFDf9D39a65A86e1";
const privKey = Buffer.from(
  "c10db65a8acf95ba32484914decab849bc838e4d3ba1269a2b6f7d23bed50f5b",
  "hex"
);
var Web3 = require("web3");
var Tx = require("ethereumjs-tx").Transaction;
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://eth-goerli.ws.alchemyapi.io/v2/-DmgmQjRZLHQDlLMHZaLSHr1hPRTJAIC",
    {
      reconnect: {
        auto: true,
        delay: 1000, // ms
        maxAttempts: 10,
      },
    }
  )
);

class Account {
  setPath(path) {
    this.path = path;
  }
  setAddress(address) {
    this.address = address;
  }
  setPublicKey(public_key) {
    this.public_key = public_key;
  }
  setPrivateKey(private_key) {
    this.private_key = private_key;
  }
  setSignMessage(sign_message) {
    this.sign_message = sign_message;
  }
  getPath() {
    return this.path;
  }
  getAddress() {
    return this.address;
  }
  getPublicKey() {
    return this.public_key;
  }
  getPrivateKey() {
    return this.private_key;
  }
  getSignMessage() {
    return this.sign_message;
  }
  constructor() {}
}
let accounts = [];

csv()
  .fromFile("tests/out.csv")
  .then((json) => {
    let acc;
    json.forEach((row) => {
      acc = new Account();
      Object.assign(acc, row);
      accounts.push(acc);
    });
  })
  .then(() => {
    accounts.forEach((account) => {
      web3.eth.getGasPrice().then((gasPrice) => {
        web3.eth.getTransactionCount(addr, "pending").then((nonce) => {
          let nonceAccount = nonce + Math.floor(Math.random() * 1000);
          let txParams = {
            nonce: web3.utils.toHex(nonceAccount),
            gasLimit: web3.utils.toHex(300000)*1.1,
            gasPrice: web3.utils.toHex(gasPrice)*1.1,
            from: addr,
            to: account.address,
            value: 0.01 * 1e18,
          };
          let tx = new Tx(txParams, { chain: "goerli" });
          tx.sign(privKey);
          tx = "0x" + tx.serialize().toString("hex");
          console.log(tx);
          web3.eth
            .sendSignedTransaction(tx)
            .on("transactionHash", (hash) => {
              console.log(hash);
            })
            .on("receipt", (receipt) => {
              console.log(receipt);
            })
            .on("confirmation", (confirmationNumber, receipt) => {
              console.log(confirmationNumber);
              console.log(receipt);
            })
            .on("error", console.error);
        });
      });
    });
  });
