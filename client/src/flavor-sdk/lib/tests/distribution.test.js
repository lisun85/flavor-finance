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
    defaultGasPrice: "1",
    accounts: [],
    ethereumNodeTimeout: 10000
  }
)
const oneEther = 10 ** 18;

describe("Distribution", () => {
  let snapshotId;
  let user;
  let user2;
  let ycrv_account = "0x0eb4add4ba497357546da7f5d12d39587ca24606";
  let weth_account = "0xf9e11762d522ea29dd78178c9baf83b7b093aacc";
  let uni_ampl_account = "0x8c545be506a335e24145edd6e01d2754296ff018";
  let comp_account = "0xc89b6f0146642688bb254bf93c28fccf1e182c81";
  let lend_account = "0x3b08aa814bea604917418a9f0907e7fc430e742c";
  let link_account = "0xbe6977e08d4479c0a6777539ae0e8fa27be4e9d6";
  let mkr_account = "0xf37216a8ac034d08b4663108d7532dfcb44583ed";
  let snx_account = "0xb696d629cd0a00560151a434f6b4478ad6c228d7"
  let yfi_account = "0x0eb4add4ba497357546da7f5d12d39587ca24606";
  beforeAll(async () => {
    const accounts = await Flavor.web3.eth.getAccounts();
    Flavor.addAccount(accounts[0]);
    user = accounts[0];
    Flavor.addAccount(accounts[1]);
    user2 = accounts[1];
    snapshotId = await Flavor.testing.snapshot();
  });

  beforeEach(async () => {
    await Flavor.testing.resetEVM("0x2");
  });

  describe("pool failures", () => {
    test("cant join pool 1s early", async () => {
      await Flavor.testing.resetEVM("0x2");
      let a = await Flavor.web3.eth.getBlock('latest');

      let starttime = await Flavor.contracts.eth_pool.methods.starttime().call();

      expect(Flavor.toBigN(a["timestamp"]).toNumber()).toBeLessThan(Flavor.toBigN(starttime).toNumber());

      //console.log("starttime", a["timestamp"], starttime);
      await Flavor.contracts.weth.methods.approve(Flavor.contracts.eth_pool.options.address, -1).send({from: user});

      await Flavor.testing.expectThrow(
        Flavor.contracts.eth_pool.methods.stake(
          Flavor.toBigN(200).times(Flavor.toBigN(10**18)).toString()
        ).send({
          from: user,
          gas: 300000
        })
      , "not start");


      a = await Flavor.web3.eth.getBlock('latest');

      starttime = await Flavor.contracts.ampl_pool.methods.starttime().call();

      expect(Flavor.toBigN(a["timestamp"]).toNumber()).toBeLessThan(Flavor.toBigN(starttime).toNumber());

      //console.log("starttime", a["timestamp"], starttime);

      await Flavor.contracts.UNIAmpl.methods.approve(Flavor.contracts.ampl_pool.options.address, -1).send({from: user});

      await Flavor.testing.expectThrow(Flavor.contracts.ampl_pool.methods.stake(
        "5016536322915819"
      ).send({
        from: user,
        gas: 300000
      }), "not start");
    });

    test("cant join pool 2 early", async () => {

    });

    test("cant withdraw more than deposited", async () => {
      await Flavor.testing.resetEVM("0x2");
      let a = await Flavor.web3.eth.getBlock('latest');

      await Flavor.contracts.weth.methods.transfer(user, Flavor.toBigN(2000).times(Flavor.toBigN(10**18)).toString()).send({
        from: weth_account
      });
      await Flavor.contracts.UNIAmpl.methods.transfer(user, "5000000000000000").send({
        from: uni_ampl_account
      });

      let starttime = await Flavor.contracts.eth_pool.methods.starttime().call();

      let waittime = starttime - a["timestamp"];
      if (waittime > 0) {
        await Flavor.testing.increaseTime(waittime);
      }

      await Flavor.contracts.weth.methods.approve(Flavor.contracts.eth_pool.options.address, -1).send({from: user});

      await Flavor.contracts.eth_pool.methods.stake(
        Flavor.toBigN(200).times(Flavor.toBigN(10**18)).toString()
      ).send({
        from: user,
        gas: 300000
      });

      await Flavor.contracts.UNIAmpl.methods.approve(Flavor.contracts.ampl_pool.options.address, -1).send({from: user});

      await Flavor.contracts.ampl_pool.methods.stake(
        "5000000000000000"
      ).send({
        from: user,
        gas: 300000
      });

      await Flavor.testing.expectThrow(Flavor.contracts.ampl_pool.methods.withdraw(
        "5016536322915820"
      ).send({
        from: user,
        gas: 300000
      }), "");

      await Flavor.testing.expectThrow(Flavor.contracts.eth_pool.methods.withdraw(
        Flavor.toBigN(201).times(Flavor.toBigN(10**18)).toString()
      ).send({
        from: user,
        gas: 300000
      }), "");

    });
  });

  describe("incentivizer pool", () => {
    test("joining and exiting", async() => {
      await Flavor.testing.resetEVM("0x2");

      await Flavor.contracts.ycrv.methods.transfer(user, "12000000000000000000000000").send({
        from: ycrv_account
      });

      await Flavor.contracts.weth.methods.transfer(user, Flavor.toBigN(2000).times(Flavor.toBigN(10**18)).toString()).send({
        from: weth_account
      });

      let a = await Flavor.web3.eth.getBlock('latest');

      let starttime = await Flavor.contracts.eth_pool.methods.starttime().call();

      let waittime = starttime - a["timestamp"];
      if (waittime > 0) {
        await Flavor.testing.increaseTime(waittime);
      } else {
        console.log("late entry", waittime)
      }

      await Flavor.contracts.weth.methods.approve(Flavor.contracts.eth_pool.options.address, -1).send({from: user});

      await Flavor.contracts.eth_pool.methods.stake(
        "2000000000000000000000"
      ).send({
        from: user,
        gas: 300000
      });

      let earned = await Flavor.contracts.eth_pool.methods.earned(user).call();

      let rr = await Flavor.contracts.eth_pool.methods.rewardRate().call();

      let rpt = await Flavor.contracts.eth_pool.methods.rewardPerToken().call();
      //console.log(earned, rr, rpt);
      await Flavor.testing.increaseTime(86400);
      // await Flavor.testing.mineBlock();

      earned = await Flavor.contracts.eth_pool.methods.earned(user).call();

      rpt = await Flavor.contracts.eth_pool.methods.rewardPerToken().call();

      let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

      console.log(earned, ysf, rpt);

      let j = await Flavor.contracts.eth_pool.methods.getReward().send({
        from: user,
        gas: 300000
      });

      let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

      console.log("Flavor bal", Flavor_bal)
      // start rebasing
        //console.log("approve Flavor")
        await Flavor.contracts.Flavor.methods.approve(
          Flavor.contracts.uni_router.options.address,
          -1
        ).send({
          from: user,
          gas: 80000
        });
        //console.log("approve ycrv")
        await Flavor.contracts.ycrv.methods.approve(
          Flavor.contracts.uni_router.options.address,
          -1
        ).send({
          from: user,
          gas: 80000
        });

        let ycrv_bal = await Flavor.contracts.ycrv.methods.balanceOf(user).call()

        console.log("ycrv_bal bal", ycrv_bal)

        console.log("add liq/ create pool")
        await Flavor.contracts.uni_router.methods.addLiquidity(
          Flavor.contracts.Flavor.options.address,
          Flavor.contracts.ycrv.options.address,
          Flavor_bal,
          Flavor_bal,
          Flavor_bal,
          Flavor_bal,
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

        await Flavor.contracts.uni_pair.methods.approve(
          Flavor.contracts.ycrv_pool.options.address,
          -1
        ).send({
          from: user,
          gas: 300000
        });

        starttime = await Flavor.contracts.ycrv_pool.methods.starttime().call();

        a = await Flavor.web3.eth.getBlock('latest');

        waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry, pool 2", waittime)
        }

        await Flavor.contracts.ycrv_pool.methods.stake(bal).send({from: user, gas: 400000});


        earned = await Flavor.contracts.ampl_pool.methods.earned(user).call();

        rr = await Flavor.contracts.ampl_pool.methods.rewardRate().call();

        rpt = await Flavor.contracts.ampl_pool.methods.rewardPerToken().call();

        console.log(earned, rr, rpt);

        await Flavor.testing.increaseTime(625000 + 1000);

        earned = await Flavor.contracts.ampl_pool.methods.earned(user).call();

        rr = await Flavor.contracts.ampl_pool.methods.rewardRate().call();

        rpt = await Flavor.contracts.ampl_pool.methods.rewardPerToken().call();

        console.log(earned, rr, rpt);

        await Flavor.contracts.ycrv_pool.methods.exit().send({from: user, gas: 400000});

        Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call();


        expect(Flavor.toBigN(Flavor_bal).toNumber()).toBeGreaterThan(0)
        console.log("Flavor bal after staking in pool 2", Flavor_bal);
    });
  });

  describe("ampl", () => {
    test("rewards from pool 1s ampl", async () => {
        await Flavor.testing.resetEVM("0x2");

        await Flavor.contracts.UNIAmpl.methods.transfer(user, "5000000000000000").send({
          from: uni_ampl_account
        });
        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.eth_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          //console.log("missed entry");
        }

        await Flavor.contracts.UNIAmpl.methods.approve(Flavor.contracts.ampl_pool.options.address, -1).send({from: user});

        await Flavor.contracts.ampl_pool.methods.stake(
          "5000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.ampl_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.ampl_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.ampl_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(625000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.ampl_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.ampl_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let j = await Flavor.contracts.ampl_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        // let k = await Flavor.contracts.eth_pool.methods.exit().send({
        //   from: user,
        //   gas: 300000
        // });
        //
        // //console.log(k.events)

        // weth_bal = await Flavor.contracts.weth.methods.balanceOf(user).call()

        // expect(weth_bal).toBe(Flavor.toBigN(2000).times(Flavor.toBigN(10**18)).toString())

        let ampl_bal = await Flavor.contracts.UNIAmpl.methods.balanceOf(user).call()

        expect(ampl_bal).toBe("5000000000000000")


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("eth", () => {
    test("rewards from pool 1s eth", async () => {
        await Flavor.testing.resetEVM("0x2");

        await Flavor.contracts.weth.methods.transfer(user, Flavor.toBigN(2000).times(Flavor.toBigN(10**18)).toString()).send({
          from: weth_account
        });

        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.eth_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await Flavor.contracts.weth.methods.approve(Flavor.contracts.eth_pool.options.address, -1).send({from: user});

        await Flavor.contracts.eth_pool.methods.stake(
          "2000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.eth_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.eth_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.eth_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(625000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.eth_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.eth_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let j = await Flavor.contracts.eth_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await Flavor.contracts.weth.methods.balanceOf(user).call()

        expect(weth_bal).toBe("2000000000000000000000")


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toString()).toBe(two_fity.times(1).toString())
    });
    test("rewards from pool 1s eth with rebase", async () => {
        await Flavor.testing.resetEVM("0x2");

        await Flavor.contracts.ycrv.methods.transfer(user, "12000000000000000000000000").send({
          from: ycrv_account
        });

        await Flavor.contracts.weth.methods.transfer(user, Flavor.toBigN(2000).times(Flavor.toBigN(10**18)).toString()).send({
          from: weth_account
        });

        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.eth_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await Flavor.contracts.weth.methods.approve(Flavor.contracts.eth_pool.options.address, -1).send({from: user});

        await Flavor.contracts.eth_pool.methods.stake(
          "2000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.eth_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.eth_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.eth_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(125000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.eth_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.eth_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);




        let j = await Flavor.contracts.eth_pool.methods.getReward().send({
          from: user,
          gas: 300000
        });

        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        console.log("Flavor bal", Flavor_bal)
        // start rebasing
          //console.log("approve Flavor")
          await Flavor.contracts.Flavor.methods.approve(
            Flavor.contracts.uni_router.options.address,
            -1
          ).send({
            from: user,
            gas: 80000
          });
          //console.log("approve ycrv")
          await Flavor.contracts.ycrv.methods.approve(
            Flavor.contracts.uni_router.options.address,
            -1
          ).send({
            from: user,
            gas: 80000
          });

          let ycrv_bal = await Flavor.contracts.ycrv.methods.balanceOf(user).call()

          console.log("ycrv_bal bal", ycrv_bal)

          console.log("add liq/ create pool")
          await Flavor.contracts.uni_router.methods.addLiquidity(
            Flavor.contracts.Flavor.options.address,
            Flavor.contracts.ycrv.options.address,
            Flavor_bal,
            Flavor_bal,
            Flavor_bal,
            Flavor_bal,
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
          //console.log("init swap")
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

          // trade back for easier calcs later
          //console.log("swap 0")
          await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
            "10000000000000000",
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

          await Flavor.testing.increaseTime(43200);

          //console.log("init twap")
          await Flavor.contracts.rebaser.methods.init_twap().send({
            from: user,
            gas: 500000
          });

          //console.log("first swap")
          await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
            "1000000000000000000000",
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
          //console.log("second swap")
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

          a = await Flavor.web3.eth.getBlock('latest');

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

          let bal1 = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

          let resFlavor = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

          let resycrv = await Flavor.contracts.ycrv.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

          // new balance > old balance
          expect(Flavor.toBigN(bal).toNumber()).toBeLessThan(Flavor.toBigN(bal1).toNumber());
          // increases reserves
          expect(Flavor.toBigN(resycrv).toNumber()).toBeGreaterThan(0);

          r = await Flavor.contracts.uni_pair.methods.getReserves().call();
          q = await Flavor.contracts.uni_router.methods.quote(Flavor.toBigN(10**18).toString(), r[0], r[1]).call();
          console.log("quote", q);
          // not below peg
          expect(Flavor.toBigN(q).toNumber()).toBeGreaterThan(Flavor.toBigN(10**18).toNumber());


        await Flavor.testing.increaseTime(525000 + 100);


        j = await Flavor.contracts.eth_pool.methods.exit().send({
          from: user,
          gas: 300000
        });
        //console.log(j.events)

        let weth_bal = await Flavor.contracts.weth.methods.balanceOf(user).call()

        expect(weth_bal).toBe("2000000000000000000000")


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(
          Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toNumber()
        ).toBeGreaterThan(two_fity.toNumber())
    });
    test("rewards from pool 1s eth with negative rebase", async () => {
        await Flavor.testing.resetEVM("0x2");

        await Flavor.contracts.ycrv.methods.transfer(user, "12000000000000000000000000").send({
          from: ycrv_account
        });

        await Flavor.contracts.weth.methods.transfer(user, Flavor.toBigN(2000).times(Flavor.toBigN(10**18)).toString()).send({
          from: weth_account
        });

        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.eth_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await Flavor.contracts.weth.methods.approve(Flavor.contracts.eth_pool.options.address, -1).send({from: user});

        await Flavor.contracts.eth_pool.methods.stake(
          "2000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.eth_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.eth_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.eth_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(125000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.eth_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.eth_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);




        let j = await Flavor.contracts.eth_pool.methods.getReward().send({
          from: user,
          gas: 300000
        });

        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        console.log("Flavor bal", Flavor_bal)
        // start rebasing
          //console.log("approve Flavor")
          await Flavor.contracts.Flavor.methods.approve(
            Flavor.contracts.uni_router.options.address,
            -1
          ).send({
            from: user,
            gas: 80000
          });
          //console.log("approve ycrv")
          await Flavor.contracts.ycrv.methods.approve(
            Flavor.contracts.uni_router.options.address,
            -1
          ).send({
            from: user,
            gas: 80000
          });

          let ycrv_bal = await Flavor.contracts.ycrv.methods.balanceOf(user).call()

          console.log("ycrv_bal bal", ycrv_bal)

          Flavor_bal = Flavor.toBigN(Flavor_bal);
          console.log("add liq/ create pool")
          await Flavor.contracts.uni_router.methods.addLiquidity(
            Flavor.contracts.Flavor.options.address,
            Flavor.contracts.ycrv.options.address,
            Flavor_bal.times(.1).toString(),
            Flavor_bal.times(.1).toString(),
            Flavor_bal.times(.1).toString(),
            Flavor_bal.times(.1).toString(),
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
          //console.log("init swap")
          await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
            "1000000000000000000000",
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

          // trade back for easier calcs later
          //console.log("swap 0")
          await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
            "100000000000000",
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

          //console.log("init twap")
          await Flavor.contracts.rebaser.methods.init_twap().send({
            from: user,
            gas: 500000
          });

          //console.log("first swap")
          await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
            "100000000000000",
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
          //console.log("second swap")
          await Flavor.contracts.uni_router.methods.swapExactTokensForTokens(
            "1000000000000000000",
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

          a = await Flavor.web3.eth.getBlock('latest');

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

          let bal1 = await Flavor.contracts.Flavor.methods.balanceOf(user).call();

          let resFlavor = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

          let resycrv = await Flavor.contracts.ycrv.methods.balanceOf(Flavor.contracts.reserves.options.address).call();

          expect(Flavor.toBigN(bal1).toNumber()).toBeLessThan(Flavor.toBigN(bal).toNumber());
          expect(Flavor.toBigN(resycrv).toNumber()).toBe(0);

          r = await Flavor.contracts.uni_pair.methods.getReserves().call();
          q = await Flavor.contracts.uni_router.methods.quote(Flavor.toBigN(10**18).toString(), r[0], r[1]).call();
          console.log("quote", q);
          // not below peg
          expect(Flavor.toBigN(q).toNumber()).toBeLessThan(Flavor.toBigN(10**18).toNumber());


        await Flavor.testing.increaseTime(525000 + 100);


        j = await Flavor.contracts.eth_pool.methods.exit().send({
          from: user,
          gas: 300000
        });
        //console.log(j.events)

        let weth_bal = await Flavor.contracts.weth.methods.balanceOf(user).call()

        expect(weth_bal).toBe("2000000000000000000000")


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(
          Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toNumber()
        ).toBeLessThan(two_fity.toNumber())
    });
  });

  describe("yfi", () => {
    test("rewards from pool 1s yfi", async () => {
        await Flavor.testing.resetEVM("0x2");
        await Flavor.contracts.yfi.methods.transfer(user, "500000000000000000000").send({
          from: yfi_account
        });

        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.yfi_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await Flavor.contracts.yfi.methods.approve(Flavor.contracts.yfi_pool.options.address, -1).send({from: user});

        await Flavor.contracts.yfi_pool.methods.stake(
          "500000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.yfi_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.yfi_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.yfi_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(625000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.yfi_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.yfi_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let j = await Flavor.contracts.yfi_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await Flavor.contracts.yfi.methods.balanceOf(user).call()

        expect(weth_bal).toBe("500000000000000000000")


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("comp", () => {
    test("rewards from pool 1s comp", async () => {
        await Flavor.testing.resetEVM("0x2");
        await Flavor.contracts.comp.methods.transfer(user, "50000000000000000000000").send({
          from: comp_account
        });

        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.comp_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await Flavor.contracts.comp.methods.approve(Flavor.contracts.comp_pool.options.address, -1).send({from: user});

        await Flavor.contracts.comp_pool.methods.stake(
          "50000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.comp_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.comp_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.comp_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(625000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.comp_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.comp_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let j = await Flavor.contracts.comp_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await Flavor.contracts.comp.methods.balanceOf(user).call()

        expect(weth_bal).toBe("50000000000000000000000")


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("lend", () => {
    test("rewards from pool 1s lend", async () => {
        await Flavor.testing.resetEVM("0x2");
        await Flavor.web3.eth.sendTransaction({from: user2, to: lend_account, value : Flavor.toBigN(100000*10**18).toString()});

        await Flavor.contracts.lend.methods.transfer(user, "10000000000000000000000000").send({
          from: lend_account
        });

        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.lend_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await Flavor.contracts.lend.methods.approve(Flavor.contracts.lend_pool.options.address, -1).send({from: user});

        await Flavor.contracts.lend_pool.methods.stake(
          "10000000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.lend_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.lend_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.lend_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(625000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.lend_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.lend_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let j = await Flavor.contracts.lend_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await Flavor.contracts.lend.methods.balanceOf(user).call()

        expect(weth_bal).toBe("10000000000000000000000000")


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("link", () => {
    test("rewards from pool 1s link", async () => {
        await Flavor.testing.resetEVM("0x2");

        await Flavor.web3.eth.sendTransaction({from: user2, to: link_account, value : Flavor.toBigN(100000*10**18).toString()});

        await Flavor.contracts.link.methods.transfer(user, "10000000000000000000000000").send({
          from: link_account
        });

        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.link_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await Flavor.contracts.link.methods.approve(Flavor.contracts.link_pool.options.address, -1).send({from: user});

        await Flavor.contracts.link_pool.methods.stake(
          "10000000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.link_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.link_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.link_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(625000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.link_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.link_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let j = await Flavor.contracts.link_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await Flavor.contracts.link.methods.balanceOf(user).call()

        expect(weth_bal).toBe("10000000000000000000000000")


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("mkr", () => {
    test("rewards from pool 1s mkr", async () => {
        await Flavor.testing.resetEVM("0x2");
        await Flavor.web3.eth.sendTransaction({from: user2, to: mkr_account, value : Flavor.toBigN(100000*10**18).toString()});
        let eth_bal = await Flavor.web3.eth.getBalance(mkr_account);

        await Flavor.contracts.mkr.methods.transfer(user, "10000000000000000000000").send({
          from: mkr_account
        });

        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.mkr_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await Flavor.contracts.mkr.methods.approve(Flavor.contracts.mkr_pool.options.address, -1).send({from: user});

        await Flavor.contracts.mkr_pool.methods.stake(
          "10000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.mkr_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.mkr_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.mkr_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(625000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.mkr_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.mkr_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let j = await Flavor.contracts.mkr_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await Flavor.contracts.mkr.methods.balanceOf(user).call()

        expect(weth_bal).toBe("10000000000000000000000")


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("snx", () => {
    test("rewards from pool 1s snx", async () => {
        await Flavor.testing.resetEVM("0x2");

        await Flavor.web3.eth.sendTransaction({from: user2, to: snx_account, value : Flavor.toBigN(100000*10**18).toString()});

        let snx_bal = await Flavor.contracts.snx.methods.balanceOf(snx_account).call();

        console.log(snx_bal)

        await Flavor.contracts.snx.methods.transfer(user, snx_bal).send({
          from: snx_account
        });

        snx_bal = await Flavor.contracts.snx.methods.balanceOf(user).call();

        console.log(snx_bal)

        let a = await Flavor.web3.eth.getBlock('latest');

        let starttime = await Flavor.contracts.snx_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await Flavor.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await Flavor.contracts.snx.methods.approve(Flavor.contracts.snx_pool.options.address, -1).send({from: user});

        await Flavor.contracts.snx_pool.methods.stake(
          snx_bal
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await Flavor.contracts.snx_pool.methods.earned(user).call();

        let rr = await Flavor.contracts.snx_pool.methods.rewardRate().call();

        let rpt = await Flavor.contracts.snx_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await Flavor.testing.increaseTime(625000 + 100);
        // await Flavor.testing.mineBlock();

        earned = await Flavor.contracts.snx_pool.methods.earned(user).call();

        rpt = await Flavor.contracts.snx_pool.methods.rewardPerToken().call();

        let ysf = await Flavor.contracts.Flavor.methods.FlavorsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let Flavor_bal = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let j = await Flavor.contracts.snx_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await Flavor.contracts.snx.methods.balanceOf(user).call()

        expect(weth_bal).toBe(snx_bal)


        let Flavor_bal2 = await Flavor.contracts.Flavor.methods.balanceOf(user).call()

        let two_fity = Flavor.toBigN(250).times(Flavor.toBigN(10**3)).times(Flavor.toBigN(10**18))
        expect(Flavor.toBigN(Flavor_bal2).minus(Flavor.toBigN(Flavor_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });
})
