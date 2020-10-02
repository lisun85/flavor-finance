import {
  Flavor
} from "../index.js";
import * as Types from "../lib/types.js";
import {
  addressMap
} from "../lib/constants.js";
import {
  decimalToString,
  stringToDecimal
} from "../lib/Helpers.js"


export const Flavor = new Flavor(
  "http://localhost:8545/",
  // "http://127.0.0.1:9545/",
  "1001",
  true, {
    defaultAccount: "",
    defaultConfirmations: 1,
    autoGasMultiplier: 1.5,
    testing: false,
    defaultGas: "6000000",
    defaultGasPrice: "1000000000000",
    accounts: [],
    ethereumNodeTimeout: 10000
  }
)
const oneEther = 10 ** 18;

describe("rebase_tests", () => {
  let snapshotId;
  let user;
  let new_user;
  // let unlocked_account = "0x0eb4add4ba497357546da7f5d12d39587ca24606";
  let unlocked_account = "0x681148725731f213b0187a3cbef215c291d85a3e";

  beforeAll(async () => {
    const accounts = await Flavor.web3.eth.getAccounts();
    Flavor.addAccount(accounts[0]);
    user = accounts[0];
    new_user = accounts[1];
    snapshotId = await Flavor.testing.snapshot();
  });

  beforeEach(async () => {
    await Flavor.testing.resetEVM("0x2");
    let a = await Flavor.contracts.ycrv.methods.transfer(user, "2000000000000000000000000").send({
      from: unlocked_account
    });
  });

  describe("rebase", () => {
    test("user has ycrv", async () => {
      let bal0 = await Flavor.contracts.ycrv.methods.balanceOf(user).call();
      expect(bal0).toBe("2000000000000000000000000");
    });
    test("create pair", async () => {
      await Flavor.contracts.uni_fact.methods.createPair(
        Flavor.contracts.ycrv.options.address,
        Flavor.contracts.Flavor.options.address
      ).send({
        from: user,
        gas: 8000000
      })
    });
    test("mint pair", async () => {
      await Flavor.contracts.Flavor.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await Flavor.contracts.ycrv.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await Flavor.contracts.uni_router.methods.addLiquidity(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address,
        10000000,
        10000000,
        10000000,
        10000000,
        user,
        1596740361 + 100000000
      ).send({
        from: user,
        gas: 8000000
      });
      let pair = await Flavor.contracts.uni_fact.methods.getPair(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address
      ).call();
      Flavor.contracts.uni_pair.options.address = pair;
      let bal = await Flavor.contracts.uni_pair.methods.balanceOf(user).call();
      expect(Flavor.toBigN(bal).toNumber()).toBeGreaterThan(100)
    });
    test("init_twap", async () => {
      await Flavor.contracts.Flavor.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await Flavor.contracts.ycrv.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await Flavor.contracts.uni_router.methods.addLiquidity(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address,
        100000,
        100000,
        100000,
        100000,
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });
      let pair = await Flavor.contracts.uni_fact.methods.getPair(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address
      ).call();
      Flavor.contracts.uni_pair.options.address = pair;
      let bal = await Flavor.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        1000,
        100,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.testing.increaseTime(1000);

      await Flavor.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });



      let init_twap = await Flavor.contracts.rebaser.methods.timeOfTWAPInit().call();
      let priceCumulativeLast = await Flavor.contracts.rebaser.methods.priceCumulativeLast().call();
      expect(Flavor.toBigN(init_twap).toNumber()).toBeGreaterThan(0);
      expect(Flavor.toBigN(priceCumulativeLast).toNumber()).toBeGreaterThan(0);
    });
    test("activate rebasing", async () => {
      await Flavor.contracts.Flavor.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await Flavor.contracts.ycrv.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await Flavor.contracts.uni_router.methods.addLiquidity(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address,
        100000,
        100000,
        100000,
        100000,
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });
      let pair = await Flavor.contracts.uni_fact.methods.getPair(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address
      ).call();
      Flavor.contracts.uni_pair.options.address = pair;
      let bal = await Flavor.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        1000,
        100,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.testing.increaseTime(1000);

      await Flavor.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });



      let init_twap = await Flavor.contracts.rebaser.methods.timeOfTWAPInit().call();
      let priceCumulativeLast = await Flavor.contracts.rebaser.methods.priceCumulativeLast().call();
      expect(Flavor.toBigN(init_twap).toNumber()).toBeGreaterThan(0);
      expect(Flavor.toBigN(priceCumulativeLast).toNumber()).toBeGreaterThan(0);

      await Flavor.testing.increaseTime(12 * 60 * 60);

      await Flavor.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });
    });
    test("positive rebasing", async () => {
      await Flavor.contracts.Flavor.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await Flavor.contracts.ycrv.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await Flavor.contracts.uni_router.methods.addLiquidity(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await Flavor.contracts.uni_fact.methods.getPair(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address
      ).call();

      Flavor.contracts.uni_pair.options.address = pair;
      let bal = await Flavor.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.testing.increaseTime(43200);

      await Flavor.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await Flavor.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await Flavor.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await Flavor.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      let res_bal = await Flavor.contracts.Flavor.methods.balanceOf(
          Flavor.contracts.reserves.options.address
      ).call();

      expect(res_bal).toBe("0");

      bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let a = await Flavor.web3.eth.getBlock('latest');

      let offset = await Flavor.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = Flavor.toBigN(offset).toNumber();
      let interval = await Flavor.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = Flavor.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await Flavor.testing.increaseTime(i);

      let r = await Flavor.contracts.uni_pair.methods.getReserves().call();
      let q = await Flavor.contracts.uni_router.methods.quote(Flavor.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote pre positive rebase", q);

      let b = await Flavor.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      });

      //console.log(b.events)
      console.log("positive rebase gas used:", b["gasUsed"]);

      let bal1 = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let resFlavor = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

      let resycrv = await Flavor.contracts.ycrv.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

      console.log("bal user, bal Flavor res, bal res crv", bal1, resFlavor, resycrv);
      r = await Flavor.contracts.uni_pair.methods.getReserves().call();
      q = await Flavor.contracts.uni_router.methods.quote(Flavor.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("post positive rebase quote", q);

      // new balance > old balance
      expect(Flavor.toBigN(bal).toNumber()).toBeLessThan(Flavor.toBigN(bal1).toNumber());
      // used full Flavor reserves
      expect(Flavor.toBigN(resFlavor).toNumber()).toBe(0);
      // increases reserves
      expect(Flavor.toBigN(resycrv).toNumber()).toBeGreaterThan(0);


      // not below peg
      expect(Flavor.toBigN(q).toNumber()).toBeGreaterThan(Flavor.toBigN(10**18).toNumber());
    });
    test("negative rebasing", async () => {
      await Flavor.contracts.Flavor.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await Flavor.contracts.ycrv.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await Flavor.contracts.uni_router.methods.addLiquidity(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await Flavor.contracts.uni_fact.methods.getPair(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address
      ).call();

      Flavor.contracts.uni_pair.options.address = pair;
      let bal = await Flavor.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.testing.increaseTime(43200);

      await Flavor.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "500000000000000000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await Flavor.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await Flavor.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await Flavor.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let a = await Flavor.web3.eth.getBlock('latest');

      let offset = await Flavor.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = Flavor.toBigN(offset).toNumber();
      let interval = await Flavor.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = Flavor.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await Flavor.testing.increaseTime(i);

      let r = await Flavor.contracts.uni_pair.methods.getReserves().call();
      let q = await Flavor.contracts.uni_router.methods.quote(Flavor.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote pre negative rebase", q);

      let b = await Flavor.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      });

      //console.log(b.events)
      console.log("negative rebase gas used:", b["gasUsed"]);

      let bal1 = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let resFlavor = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

      let resycrv = await Flavor.contracts.ycrv.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

      // balance decreases
      expect(Flavor.toBigN(bal1).toNumber()).toBeLessThan(Flavor.toBigN(bal).toNumber());
      // no increases to reserves
      expect(Flavor.toBigN(resFlavor).toNumber()).toBe(0);
      expect(Flavor.toBigN(resycrv).toNumber()).toBe(0);
    });
    test("no rebasing", async () => {
      await Flavor.contracts.Flavor.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await Flavor.contracts.ycrv.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await Flavor.contracts.uni_router.methods.addLiquidity(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await Flavor.contracts.uni_fact.methods.getPair(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address
      ).call();

      Flavor.contracts.uni_pair.options.address = pair;
      let bal = await Flavor.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.testing.increaseTime(43200);

      await Flavor.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await Flavor.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await Flavor.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await Flavor.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let a = await Flavor.web3.eth.getBlock('latest');

      let offset = await Flavor.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = Flavor.toBigN(offset).toNumber();
      let interval = await Flavor.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = Flavor.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await Flavor.testing.increaseTime(i);

      let r = await Flavor.contracts.uni_pair.methods.getReserves().call();
      console.log(r, r[0], r[1]);
      let q = await Flavor.contracts.uni_router.methods.quote(Flavor.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote pre no rebase", q);
      let b = await Flavor.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      });

      console.log("no rebase gas used:", b["gasUsed"]);

      let bal1 = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let resFlavor = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

      let resycrv = await Flavor.contracts.ycrv.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

      // no change
      expect(Flavor.toBigN(bal1).toNumber()).toBe(Flavor.toBigN(bal).toNumber());
      // no increases to reserves
      expect(Flavor.toBigN(resFlavor).toNumber()).toBe(0);
      expect(Flavor.toBigN(resycrv).toNumber()).toBe(0);
      r = await Flavor.contracts.uni_pair.methods.getReserves().call();
      q = await Flavor.contracts.uni_router.methods.quote(Flavor.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote post no rebase", q);
    });
    test("rebasing with Flavor in reserves", async () => {
      await Flavor.contracts.Flavor.methods.transfer(Flavor.contracts.reserves.options.address, Flavor.toBigN(60000*10**18).toString()).send({from: user});
      await Flavor.contracts.Flavor.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await Flavor.contracts.ycrv.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await Flavor.contracts.uni_router.methods.addLiquidity(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await Flavor.contracts.uni_fact.methods.getPair(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address
      ).call();

      Flavor.contracts.uni_pair.options.address = pair;
      let bal = await Flavor.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.testing.increaseTime(43200);

      await Flavor.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "500000000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await Flavor.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await Flavor.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await Flavor.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let a = await Flavor.web3.eth.getBlock('latest');

      let offset = await Flavor.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = Flavor.toBigN(offset).toNumber();
      let interval = await Flavor.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = Flavor.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await Flavor.testing.increaseTime(i);


      let r = await Flavor.contracts.uni_pair.methods.getReserves().call();
      let q = await Flavor.contracts.uni_router.methods.quote(Flavor.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote pre pos rebase with reserves", q);

      let b = await Flavor.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      });
      //console.log(b.events)

      console.log("positive  with reserves gas used:", b["gasUsed"]);

      let bal1 = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let resFlavor = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

      let resycrv = await Flavor.contracts.ycrv.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

      console.log(bal, bal1, resFlavor, resycrv);
      expect(Flavor.toBigN(bal).toNumber()).toBeLessThan(Flavor.toBigN(bal1).toNumber());
      expect(Flavor.toBigN(resFlavor).toNumber()).toBeGreaterThan(0);
      expect(Flavor.toBigN(resycrv).toNumber()).toBeGreaterThan(0);
      r = await Flavor.contracts.uni_pair.methods.getReserves().call();
      q = await Flavor.contracts.uni_router.methods.quote(Flavor.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote post rebase w/ reserves", q);
      expect(Flavor.toBigN(q).toNumber()).toBeGreaterThan(Flavor.toBigN(10**18).toNumber());
    });
  });

  describe("failing", () => {
    test("unitialized rebasing", async () => {
      await Flavor.testing.expectThrow(Flavor.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      }), "twap wasnt intitiated, call init_twap()");
    });
    test("no early twap", async () => {
      await Flavor.testing.expectThrow(Flavor.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      }), "");
    });
    test("too late rebasing", async () => {
      await Flavor.contracts.Flavor.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await Flavor.contracts.ycrv.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await Flavor.contracts.uni_router.methods.addLiquidity(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await Flavor.contracts.uni_fact.methods.getPair(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address
      ).call();

      Flavor.contracts.uni_pair.options.address = pair;
      let bal = await Flavor.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.testing.increaseTime(43200);

      await Flavor.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "500000000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await Flavor.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await Flavor.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await Flavor.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let a = await Flavor.web3.eth.getBlock('latest');

      let offset = await Flavor.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = Flavor.toBigN(offset).toNumber();
      let interval = await Flavor.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = Flavor.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      let len = await Flavor.contracts.rebaser.methods.rebaseWindowLengthSec().call();

      await Flavor.testing.increaseTime(i + Flavor.toBigN(len).toNumber()+1);

      let b = await Flavor.testing.expectThrow(Flavor.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      }), "too late");
    });
    test("too early rebasing", async () => {
      await Flavor.contracts.Flavor.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await Flavor.contracts.ycrv.methods.approve(
        Flavor.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await Flavor.contracts.uni_router.methods.addLiquidity(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await Flavor.contracts.uni_fact.methods.getPair(
        Flavor.contracts.Flavor.options.address,
        Flavor.contracts.ycrv.options.address
      ).call();

      Flavor.contracts.uni_pair.options.address = pair;
      let bal = await Flavor.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await Flavor.testing.increaseTime(43200);

      await Flavor.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "500000000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await Flavor.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await Flavor.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          Flavor.contracts.ycrv.options.address,
          Flavor.contracts.Flavor.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await Flavor.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });

      bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

      let a = await Flavor.web3.eth.getBlock('latest');

      let offset = await Flavor.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = Flavor.toBigN(offset).toNumber();
      let interval = await Flavor.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = Flavor.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await Flavor.testing.increaseTime(i - 1);



      let b = await Flavor.testing.expectThrow(Flavor.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      }), "too early");
    });
  });
});
