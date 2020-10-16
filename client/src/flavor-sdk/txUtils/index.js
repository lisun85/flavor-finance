import { ethers } from "ethers";
import Web3 from "web3";
import BigNumber from "bignumber.js";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const GAS_LIMIT = {
  DEPOSITING: {
    DEFAULT: 200000,
  },
  APPROVING: {
    DEFAULT: 200000,
  },
};

/*

function send(address recipient, uint256 amount, bytes memory data)

withdrawAndRedeemCollateral(uint256 collateral)

 function balanceOf(address tokenHolder)

 function totalSupply() public view returns (uint256)

*/

export const approve = async (
  Flavor,
  podContractAddress,
  tokenAddress,
  account,
  onTxHash
) => {
  const usdcContract = Flavor.contracts.flavorPod;
  usdcContract.options.address = tokenAddress
  return usdcContract.methods
    .approve(podContractAddress, ethers.constants.MaxUint256)
    .send({ from: account, gas: 80000 })
};

export const deposit = async (
  Flavor,
  podContractAddress,
  amount,
  account,
  onTxHash
) => {
  const flavorPodContract = Flavor.contracts.flavorPod; // TODO: change to flavorPod
  flavorPodContract.options.address = podContractAddress;
  window.console.log("set pod contract address to ", podContractAddress);
  const gas = GAS_LIMIT.DEPOSITING.DEFAULT;

  const usdcAmount = new BigNumber(amount)
    .times(new BigNumber(10).pow(6))
    .toString();

  return flavorPodContract.methods
        .deposit(account, usdcAmount)
        .send({ from: account, gas }, async (error, txHash) => {
          if (error) {
            onTxHash && onTxHash("");
            console.log("Depositing error", error);
            return false;
          }
          onTxHash && onTxHash(txHash);
          const status = await waitTransaction(Flavor.web3.eth, txHash);
          if (!status) {
            console.log("Depositing transaction failed.");
            return false;
          }
          return true;
        });
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const waitTransaction = async (provider, txHash) => {
  const web3 = new Web3(provider);
  let txReceipt = null;
  while (txReceipt === null) {
    const r = await web3.eth.getTransactionReceipt(txHash);
    txReceipt = r;
    await sleep(2000);
  }
  return txReceipt.status;
};
