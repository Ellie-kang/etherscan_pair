import { useState } from "react";

function App() {
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState("");
  const [transactionInfo, setTransactionInfo] = useState("");

  const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setIsLoading(false);
    } else {
      console.log("MetaMask should installed!");
    }
  };

  const getBalance = async () => {
    const sendAccount = {
      account: { account },
    };
    fetch("http://localhost:8080/balance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendAccount),
    }).then((res) => {
      res.json().then((res) => {
        setBalance(res.bal);
      });
    });
  };

  const getTx = (e) => {
    e.preventDefault();
    const sendTx = { txInfo: e.target[1].value };
    fetch("http://localhost:8080/txinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendTx),
    }).then((res) => {
      return res.json().then((res) => {
        setTransactionInfo(res);
      });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>EtherScan</h1>
      </header>

      <button onClick={connectMetamask}>계정 연결</button>
      <h3>계정 : {isLoading ? "계정 정보를 조회중입니다" : account}</h3>
      <button onClick={getBalance}>계정 잔액 확인</button>
      <h3>
        잔액 : {balance ? `${balance} ETH` : "계정의 잔고를 확인중입니다"}
      </h3>
      <form onSubmit={getTx}>
        <button>트랜잭션 정보 확인</button>
        <input
          placeholder="조회할 Tx 정보를 기입해 주세요"
          style={{ width: "450px" }}
        ></input>
        <button type="submit">조회</button>
        {transactionInfo ? (
          <h4>
            <ul>
              <li>Transaction hash : {transactionInfo.transactionHash}</li>
              <li>From : {transactionInfo.from}</li>
              <li>To : {transactionInfo.to}</li>
              <li>Value : {`${transactionInfo.value} ETH`}</li>
              <li>Transaction Fee : {transactionInfo.transactionFee}</li>
              <li>Gas Price : {transactionInfo.gasPrice}</li>
              <li>Block Number : {transactionInfo.blockNumber}</li>
            </ul>
          </h4>
        ) : null}
      </form>
    </div>
  );
}

export default App;
