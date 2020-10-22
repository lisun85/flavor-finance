import { ethers } from "ethers";
import Web3 from "web3";
import BigNumber from "bignumber.js";

const USDC_POW = 18

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
  onTxHash,
  onComplete
) => {
  const usdcContract = Flavor.contracts.flavorPod;
  usdcContract.options.address = tokenAddress
  return usdcContract.methods
    .approve(podContractAddress, ethers.constants.MaxUint256)
    .send({ from: account, gas: 80000 }, async (error, txHash) => {
      if (error) {
        onTxHash && onTxHash(txHash);
        console.log("Approval error", error);
        onComplete && onComplete(error);
        return false;
      }
      onTxHash && onTxHash(txHash);
      const status = await waitTransaction(Flavor.web3.eth, txHash);

      if (!status) {
        console.log("Approval transaction failed.");
        onComplete && onComplete('failed');
        return false;
      }
      onComplete && onComplete();
      return true;
    })

};

export const deposit = async (
  Flavor,
  podContractAddress,
  amount,
  account,
  onTxHash,
  onComplete
) => {
  const flavorPodContract = Flavor.contracts.flavorPod; // TODO: change to flavorPod
  flavorPodContract.options.address = podContractAddress;
  window.console.log("set pod contract address to ", podContractAddress);
  const gas = GAS_LIMIT.DEPOSITING.DEFAULT;

  const usdcAmount = new BigNumber(amount)
    .times(new BigNumber(10).pow(USDC_POW))
    .toString();

  window.console.error('depositing amount', amount, 'usdc amount', usdcAmount, 'account', account);
  ///index.js:61 depositing amount 20 usdc amount 20000000
// invalid arrayify value (argument="value", value="20000000", code=INVALID_ARGUMENT, version=bytes/5.0.4)

  return flavorPodContract.methods
        .deposit(usdcAmount, [])
        .send({ from: account, gas }, async (error, txHash) => {
          if (error) {
            onTxHash && onTxHash("");
            console.log("Depositing error", error);
            onComplete && onComplete(error);
            return false;
          }
          onTxHash && onTxHash(txHash);
          const status = await waitTransaction(Flavor.web3.eth, txHash);
          onComplete && onComplete();
          if (!status) {
            console.log("Depositing transaction failed.");
            return false;
          }
          return true;
        });
};

export const withdraw = async (
  Flavor,
  podContractAddress,
  amount,
  account,
  onTxHash,
  onComplete
) => {
  const flavorPodContract = Flavor.contracts.flavorPod; // TODO: change to flavorPod
  flavorPodContract.options.address = podContractAddress;
  window.console.log("set pod contract address to ", podContractAddress);
  const gas = GAS_LIMIT.DEPOSITING.DEFAULT;

  const usdcAmount = new BigNumber(amount)
    .times(new BigNumber(10).pow(USDC_POW))
    .toString();

  window.console.log('withdrawing amount', amount, 'usdc amount', usdcAmount);

  return flavorPodContract.methods
        .withdrawAndRedeemCollateral(usdcAmount)
        .send({ from: account, gas }, async (error, txHash) => {
          if (error) {
            onTxHash && onTxHash("");
            onComplete && onComplete(error);
            console.log("Depositing error", error);
            return false;
          }
          onTxHash && onTxHash(txHash);
          const status = await waitTransaction(Flavor.web3.eth, txHash);
          onComplete && onComplete();
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
