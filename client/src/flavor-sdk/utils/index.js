import {ethers} from 'ethers'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  }
};

export const getPoolStartTime = async (poolContract) => {
  return await poolContract.methods.starttime().call()
}

export const stake = async (Flavor, amount, account, onTxHash) => {
  const poolContract = Flavor.contracts.yycrv_pool
  let now = new Date().getTime() / 1000;
  // const gas = GAS_LIMIT.STAKING[tokenName.toUpperCase()] || GAS_LIMIT.STAKING.DEFAULT;
  const gas = GAS_LIMIT.STAKING.DEFAULT
  if (now >= 1597172400) {
    return poolContract.methods
      .stake((new BigNumber(amount).times(new BigNumber(10).pow(18))).toString())
      .send({ from: account, gas }, async (error, txHash) => {
        if (error) {
            onTxHash && onTxHash('')
            console.log("Staking error", error)
            return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(Flavor.web3.eth, txHash)
        if (!status) {
          console.log("Staking transaction failed.")
          return false
        }
        return true
      })
  } else {
    alert("pool not active");
  }
}

export const unstake = async (Flavor, amount, account, onTxHash) => {
  const poolContract = Flavor.contracts.yycrv_pool
  let now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return poolContract.methods
      .withdraw((new BigNumber(amount).times(new BigNumber(10).pow(18))).toString())
      .send({ from: account, gas: 200000 }, async (error, txHash) => {
        if (error) {
            onTxHash && onTxHash('')
            console.log("Unstaking error", error)
            return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(Flavor.web3.eth, txHash)
        if (!status) {
          console.log("Unstaking transaction failed.")
          return false
        }
        return true
      })
  } else {
    alert("pool not active");
  }
}

export const harvest = async (Flavor, account, onTxHash) => {
  const poolContract = Flavor.contracts.yycrv_pool
  let now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return poolContract.methods
      .getReward()
      .send({ from: account, gas: 200000 }, async (error, txHash) => {
        if (error) {
            onTxHash && onTxHash('')
            console.log("Harvest error", error)
            return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(Flavor.web3.eth, txHash)
        if (!status) {
          console.log("Harvest transaction failed.")
          return false
        }
        return true
      })
  } else {
    alert("pool not active");
  }
}

export const redeem = async (Flavor, account, onTxHash) => {
  const poolContract = Flavor.contracts.yycrv_pool
  let now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return poolContract.methods
      .exit()
      .send({ from: account, gas: 400000 }, async (error, txHash) => {
        if (error) {
            onTxHash && onTxHash('')
            console.log("Redeem error", error)
            return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(Flavor.web3.eth, txHash)
        if (!status) {
          console.log("Redeem transaction failed.")
          return false
        }
        return true
      })
  } else {
    alert("pool not active");
  }
}

export const approve = async (tokenContract, poolContract, account) => {
  return tokenContract.methods
    .approve(poolContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gas: 80000 })
}

export const getPoolContracts = async (Flavor) => {
  const pools = Object.keys(Flavor.contracts)
    .filter(c => c.indexOf('_pool') !== -1)
    .reduce((acc, cur) => {
      const newAcc = { ...acc }
      newAcc[cur] = Flavor.contracts[cur]
      return newAcc
    }, {})
  return pools
}

export const getEarned = async (Flavor, pool, account) => {
  return BigNumber(0);
  const scalingFactor = new BigNumber(await Flavor.contracts.FlavorV3.methods.FlavorsScalingFactor().call())
  const earned = new BigNumber(await pool.methods.earned(account).call())
  return earned.multipliedBy(scalingFactor.dividedBy(new BigNumber(10).pow(18)))
}

export const getStaked = async (Flavor, pool, account) => {
  return BigNumber(0);
  return Flavor.toBigN(await pool.methods.balanceOf(account).call())
}

export const getCurrentPrice = async (Flavor) => {
  // FORBROCK: get current Flavor price
  return new BigNumber(0);//return new BigNumber(await Flavor.contracts.rebaser.methods.getCurrentTWAP().call())
}

export const getTargetPrice = async (Flavor) => {
  return Flavor.toBigN(1).toFixed(2);
}

export const getCirculatingSupply = async (Flavor) => {
  let now = await Flavor.web3.eth.getBlock('latest');
  let scalingFactor = Flavor.toBigN(await Flavor.contracts.FlavorV3.methods.FlavorsScalingFactor().call());
  let starttime = Flavor.toBigN(await Flavor.contracts.eth_pool.methods.starttime().call()).toNumber();
  let timePassed = now["timestamp"] - starttime;
  if (timePassed < 0) {
    return BigNumber(0);
  }
  let FlavorsDistributed = Flavor.toBigN(8 * timePassed * 250000 / 625000); //Flavors from first 8 pools
  let starttimePool2 = Flavor.toBigN(await Flavor.contracts.ycrv_pool.methods.starttime().call()).toNumber();
  timePassed = now["timestamp"] - starttime;
  let pool2Flavors = Flavor.toBigN(timePassed * 1500000 / 625000); // Flavors from second pool. note: just accounts for first week
  let circulating = pool2Flavors.plus(FlavorsDistributed).times(scalingFactor).dividedBy(10**36).toFixed(2)
  return circulating
}

export const getLastRebaseTimestamp = async (Flavor) => {
  try {
    const lastTimestamp = Flavor.toBigN(await Flavor.contracts.rebaser.methods.lastRebaseTimestampSec().call()).toNumber()
    return lastTimestamp
  } catch (e) {
    console.log(e)
  }
}

export const getNextRebaseTimestamp = async (Flavor) => {
  try {
    let now = await Flavor.web3.eth.getBlock('latest').then(res => res.timestamp);
    let interval = 43200; // 12 hours
    let offset = 28800; // 8am/8pm utc
    let secondsToRebase = 0;
    if (await Flavor.contracts.rebaser.methods.rebasingActive().call()) {
      if (now % interval > offset) {
          secondsToRebase = (interval - (now % interval)) + offset;
       } else {
          secondsToRebase = offset - (now % interval);
      }
    }
    return secondsToRebase
  } catch (e) {
    console.log(e)
  }
}

export const getTotalSupply = async (Flavor) => {
  return await Flavor.contracts.Flavor.methods.totalSupply().call();
}

export const getStats = async (Flavor) => {
  const curPrice = await getCurrentPrice(Flavor)
  const circSupply = await getCirculatingSupply(Flavor)
  const nextRebase = await getNextRebaseTimestamp(Flavor)
  const targetPrice = await getTargetPrice(Flavor)
  const totalSupply = await getTotalSupply(Flavor)
  return {
    circSupply,
    curPrice,
    nextRebase,
    targetPrice,
    totalSupply
  }
}

export const vote = async (Flavor, account) => {
  return Flavor.contracts.gov.methods.castVote(0, true).send({ from: account })
}

export const delegate = async (Flavor, account) => {
  return Flavor.contracts.Flavor.methods.delegate("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: account, gas: 320000 })
}

export const didDelegate = async (Flavor, account) => {
  return await Flavor.contracts.Flavor.methods.delegates(account).call() === '0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84'
}

export const getVotes = async (Flavor) => {
  const votesRaw = new BigNumber(await Flavor.contracts.Flavor.methods.getCurrentVotes("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").call()).dividedBy(10**24)
  return votesRaw
}

export const getScalingFactor = async (Flavor) => {
  return new BigNumber(await Flavor.contracts.FlavorV3.methods.FlavorsScalingFactor().call())
}

export const getDelegatedBalance = async (Flavor, account) => {
  return new BigNumber(await Flavor.contracts.Flavor.methods.balanceOfUnderlying(account).call()).dividedBy(10**24)
}

export const migrate = async (Flavor, account) => {
  return Flavor.contracts.FlavorV2migration.methods.migrate().send({ from: account, gas: 320000 })
}

export const getMigrationEndTime = async (Flavor) => {
  return Flavor.toBigN(await Flavor.contracts.FlavorV2migration.methods.startTime().call()).plus(Flavor.toBigN(86400*3)).toNumber()
}

export const getV2Supply = async (Flavor) => {
  return new BigNumber(await Flavor.contracts.FlavorV2.methods.totalSupply().call())
}

export const migrationStarted = async (Flavor) => {
  let now = new Date().getTime() / 1000; // get current time
  let startTime = await Flavor.contracts.migrator.methods.startTime().call();
  let token_initialized = await Flavor.contracts.migrator.methods.token_initialized().call();
  let delegatorRewardsSet = await Flavor.contracts.migrator.methods.delegatorRewardsSet().call();
  if (now >= startTime && token_initialized && delegatorRewardsSet) {
    return true;
  }
  return false;
}

const FlavorToFragment = async (Flavor, amount) => {
  return BigNumber(0);
  let BASE24 = new BigNumber(10).pow(24);
  let scalingFactor = new BigNumber(await Flavor.contracts.FlavorV3.methods.FlavorsScalingFactor().call());

  return amount.multipliedBy(scalingFactor).dividedBy(BASE24);
}

export const currVested = async (Flavor, account) => {
  return BigNumber(0);
  let BASE = new BigNumber(10).pow(18);

  let vested = new BigNumber(await Flavor.contracts.migrator.methods.vested(account).call());
  let amt = await FlavorToFragment(Flavor, vested);
  return amt.dividedBy(BASE);
}

export const currUnclaimedDelegatorRewards = async (Flavor, account) => {
  return BigNumber(0);
  let BASE = new BigNumber(10).pow(18);
  let BASE24 = new BigNumber(10).pow(24);

  let start = new BigNumber(1600444800);
  let duration = new BigNumber(90 * 86400);
  let now = new BigNumber(new Date().getTime() / 1000);
  let percDone = now.minus(start).dividedBy(duration);
  if (percDone.gt(1)) {
    percDone = new BigNumber(1)
  }
  let totalVesting = new BigNumber(await Flavor.contracts.migrator.methods.delegator_vesting(account).call());
  let claimed = new BigNumber(await Flavor.contracts.migrator.methods.delegator_claimed(account).call());
  let unclaimed = ((totalVesting.multipliedBy(percDone)).minus(claimed));
  let amt = await FlavorToFragment(Flavor, unclaimed);
  return amt.dividedBy(BASE);
}

export const currUnclaimedMigratorVesting = async (Flavor, account) => {
  return BigNumber(0);
  let BASE = new BigNumber(10).pow(18);
  let BASE24 = new BigNumber(10).pow(24);

  let start = new BigNumber(1600444800);
  let duration = new BigNumber(30 * 86400);
  let now = new BigNumber(new Date().getTime() / 1000);
  let percDone = now.minus(start).dividedBy(duration);
  if (percDone.gt(1)) {
    percDone = new BigNumber(1)
  }
  let totalVesting = new BigNumber(await Flavor.contracts.migrator.methods.vesting(account).call());
  let claimed = new BigNumber(await Flavor.contracts.migrator.methods.claimed(account).call());
  let unclaimed = ((totalVesting.multipliedBy(percDone)).minus(claimed));
  let amt = await FlavorToFragment(Flavor, unclaimed);
  return amt.dividedBy(BASE);
}

export const delegatorRewards = async (Flavor, account) => {
  let BASE = new BigNumber(10).pow(18);
  let BASE24 = new BigNumber(10).pow(24);

  let rewards = new BigNumber(await Flavor.contracts.migrator.methods.delegator_vesting(account).call());
  let amt = await FlavorToFragment(Flavor, rewards);
  return amt.dividedBy(BASE);
}

export const migrateV3 = async (Flavor, account, onTxHash) => {
    return await Flavor.contracts.migrator.methods.migrate()
      .send({from: account, gas: 200000}, async (error, txHash) => {
        if (error) {
            onTxHash && onTxHash('')
            console.log("Migration error", error)
            return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(Flavor.web3.eth, txHash)
        if (!status) {
          console.log("Migration transaction failed.")
          return false
        }
        return true
      })
}

export const claimVested = async (Flavor, account, onTxHash) => {
  return await Flavor.contracts.migrator.methods.claimVested().send({from: account, gas: 140000});
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const waitTransaction = async (provider, txHash) => {
  const web3 = new Web3(provider)
  let txReceipt = null
  while (txReceipt === null) {
    const r = await web3.eth.getTransactionReceipt(txHash)
    txReceipt = r
    await sleep(2000)
  }
  return (txReceipt.status)
}
