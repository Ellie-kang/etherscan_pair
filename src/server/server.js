"use strict";

const express = require("express");
const cors = require("cors");
const Web3 = require("web3");
const bodyParser = require("body-parser");

const rpcURL = "https://goerli.infura.io/v3/ddcb784efca34cd9b2d641d8caa88c94";
const app = express();
const PORT = 8080;
const web3 = new Web3(rpcURL);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let getBalance = [];

const _getBalance = async (account) => {
  return await web3.eth.getBalance(account).then(async (bal) => {
    const balance = await web3.utils.fromWei(bal, "ether");
    getBalance.push(balance);
    return balance;
  });
};

const _getTx = async (tx) => {
  return await web3.eth.getTransaction(tx);
};

app.get("/", (req, res) => {
  res.send("ㅗ");
});

app.post("/balance", (req, res) => {
  _getBalance(req.body.account.account).then((bal) => {
    res.json({ bal: bal });
  });
});

app.post("/txinfo", (req, res) => {
  _getTx(req.body.txInfo).then((tx) => {
    res.json({
      transactionHash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: web3.utils.fromWei(tx.value, "ether"),
      transactionFee: tx.gas,
      gasPrice: tx.gasPrice,
      blockNumber: tx.blockNumber,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Listening... http://localhost:${PORT}`);
});
