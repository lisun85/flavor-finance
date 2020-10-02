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

describe("token_tests", () => {
  let snapshotId;
  let user = "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84";
  let new_user;
  beforeAll(async () => {
    const accounts = await Flavor.web3.eth.getAccounts();
    Flavor.addAccount(accounts[0]);
    new_user = accounts[1];
    snapshotId = await Flavor.testing.snapshot();
  });

  beforeEach(async () => {
    await Flavor.testing.resetEVM("0x2");
  });

  // describe("expected fail", () => {
  //   test("before start", async () => {
  //     await Flavor.testing.resetEVM("0x2");
  //     let startTime = await Flavor.contracts.FlavorV2migration.methods.startTime().call();
  //     let timeNow = Flavor.toBigN((await Flavor.web3.eth.getBlock('latest'))["timestamp"]);
  //     let waitTime = Flavor.toBigN(startTime).minus(timeNow);
  //     if (waitTime <= 0) {
  //       // this test is hard to run on ganache as there is no easy way to
  //       // ensure that another test hasnt increased the time already
  //       console.log("WARNING: TEST CANNOT OCCUR DUE TO GANACHE TIMING");
  //     } else {
  //       await Flavor.testing.expectThrow(Flavor.contracts.FlavorV2migration.methods.migrate().send({from: user}), "!started");
  //     }
  //   });
  //   test("user 0 balance", async () => {
  //     // fast forward to startTime
  //     let startTime = await Flavor.contracts.FlavorV2migration.methods.startTime().call();
  //     let timeNow = Flavor.toBigN((await Flavor.web3.eth.getBlock('latest'))["timestamp"]);
  //     let waitTime = Flavor.toBigN(startTime).minus(timeNow);
  //     if (waitTime.toNumber() > 0) {
  //       await Flavor.testing.increaseTime(waitTime.toNumber());
  //     }
  //     await Flavor.testing.expectThrow(Flavor.contracts.FlavorV2migration.methods.migrate().send({from: new_user}), "No Flavors");
  //   });
  //   test("after end", async () => {
  //     // increase time
  //     let startTime = await Flavor.contracts.FlavorV2migration.methods.startTime().call();
  //     let migrationDuration = await Flavor.contracts.FlavorV2migration.methods.migrationDuration().call();
  //     let timeNow = Flavor.toBigN((await Flavor.web3.eth.getBlock('latest'))["timestamp"]);
  //     let waitTime = Flavor.toBigN(startTime).plus(Flavor.toBigN(migrationDuration)).minus(timeNow);
  //     if (waitTime.toNumber() > 0) {
  //       await Flavor.testing.increaseTime(waitTime.toNumber());
  //     }
  //     // expect fail
  //     await Flavor.testing.expectThrow(Flavor.contracts.FlavorV2migration.methods.migrate().send({from: user}), "migration ended");
  //   });
  //   test("double migrate", async () => {
  //     await Flavor.contracts.Flavor.methods.approve(Flavor.contracts.FlavorV2migration.options.address, "10000000000000000000000000000000000").send({from: user, gas: 1000000});
  //     await Flavor.contracts.FlavorV2migration.methods.migrate().send({from: user, gas: 1000000});
  //     let Flavor_bal = Flavor.toBigN(await Flavor.contracts.Flavor.methods.balanceOfUnderlying(user).call()).toNumber();
  //     await Flavor.testing.expectThrow(Flavor.contracts.FlavorV2migration.methods.migrate().send({from: user, gas: 1000000}), "No Flavors");
  //   });
  // });

  describe("non-failing", () => {
    test("zeros balance", async () => {
      let startTime = await Flavor.contracts.FlavorV2migration.methods.startTime().call();
      let timeNow = Flavor.toBigN((await Flavor.web3.eth.getBlock('latest'))["timestamp"]);
      let waitTime = Flavor.toBigN(startTime).minus(timeNow);
      if (waitTime.toNumber() > 0) {
        await Flavor.testing.increaseTime(waitTime.toNumber());
      }
      await Flavor.contracts.Flavor.methods.approve(Flavor.contracts.FlavorV2migration.options.address, "10000000000000000000000000000000000").send({from: user, gas: 1000000});
      await Flavor.contracts.FlavorV2migration.methods.migrate().send({from: user, gas: 1000000});
      let Flavor_bal = Flavor.toBigN(await Flavor.contracts.Flavor.methods.balanceOf(user).call()).toNumber();
      expect(Flavor_bal).toBe(0);
    });
    test("v2 balance equal to v1 underlying balance", async () => {
      let startTime = await Flavor.contracts.FlavorV2migration.methods.startTime().call();
      let timeNow = Flavor.toBigN((await Flavor.web3.eth.getBlock('latest'))["timestamp"]);
      let waitTime = Flavor.toBigN(startTime).minus(timeNow);
      if (waitTime.toNumber() > 0) {
        await Flavor.testing.increaseTime(waitTime.toNumber());
      }
      let Flavor_bal = Flavor.toBigN(await Flavor.contracts.Flavor.methods.balanceOfUnderlying(user).call());
      await Flavor.contracts.Flavor.methods.approve(Flavor.contracts.FlavorV2migration.options.address, "10000000000000000000000000000000000").send({from: user, gas: 1000000});
      await Flavor.contracts.FlavorV2migration.methods.migrate().send({from: user, gas: 1000000});
      let FlavorV2_bal = Flavor.toBigN(await Flavor.contracts.FlavorV2.methods.balanceOf(user).call());
      expect(Flavor_bal.toString()).toBe(FlavorV2_bal.toString());
    });
    test("totalSupply increase equal to Flavor_underlying_bal", async () => {
      let startTime = await Flavor.contracts.FlavorV2migration.methods.startTime().call();
      let timeNow = Flavor.toBigN((await Flavor.web3.eth.getBlock('latest'))["timestamp"]);
      let waitTime = Flavor.toBigN(startTime).minus(timeNow);
      if (waitTime.toNumber() > 0) {
        await Flavor.testing.increaseTime(waitTime.toNumber());
      }
      let Flavor_underlying_bal = Flavor.toBigN(await Flavor.contracts.Flavor.methods.balanceOfUnderlying(user).call());
      await Flavor.contracts.Flavor.methods.approve(Flavor.contracts.FlavorV2migration.options.address, "10000000000000000000000000000000000").send({from: user, gas: 1000000});
      await Flavor.contracts.FlavorV2migration.methods.migrate().send({from: user, gas: 1000000});
      let FlavorV2_ts = Flavor.toBigN(await Flavor.contracts.FlavorV2.methods.totalSupply().call());
      expect(FlavorV2_ts.toString()).toBe(Flavor_underlying_bal.toString());
    });
  });
});
