import React, { useState } from "react";
import { ethers } from "ethers";
import "./Header.css";
import NewForm from "./NewForm";

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

	const ethereum = window.ethereum;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const connectWalletHandler = () => {
    if (ethereum && ethereum.isMetaMask) {
      console.log("MetaMask Here!");
      ethereum.request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
          getAccountBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  ethereum.on("accountsChanged", accountChangedHandler);
  ethereum.on("chainChanged", chainChangedHandler);

	return (
    <>
      <div className="walletCard">
        <h4> {"Connection to MetaMask using ethereum methods"} </h4>
        <button onClick={connectWalletHandler}>{connButtonText}</button>
        <div className="accountDisplay">
          <h3>Address: {defaultAccount}</h3>
        </div>
        <div className="balanceDisplay">
          <h3>Balance: {userBalance}</h3>
        </div>
        {errorMessage}
      </div>
      <NewForm address={defaultAccount}/>
    </>
  );
};

export default WalletCard;
