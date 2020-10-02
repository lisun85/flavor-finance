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

describe("post-deployment", () => {
  let snapshotId;
  let user;

  beforeAll(async () => {
    const accounts = await Flavor.web3.eth.getAccounts();
    Flavor.addAccount(accounts[0]);
    user = accounts[0];
    snapshotId = await Flavor.testing.snapshot();
  });

  beforeEach(async () => {
    await Flavor.testing.resetEVM("0x2");
  });

  describe("supply ownership", () => {

    test("owner balance", async () => {
      let balance = await Flavor.contracts.Flavor.methods.balanceOf(user).call();
      expect(balance).toBe(Flavor.toBigN(7000000).times(Flavor.toBigN(10**18)).toString())
    });

    test("pool balances", async () => {
      let ycrv_balance = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.ycrv_pool.options.address).call();

      expect(ycrv_balance).toBe(Flavor.toBigN(1500000).times(Flavor.toBigN(10**18)).times(Flavor.toBigN(1)).toString())

      let yfi_balance = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.yfi_pool.options.address).call();

      expect(yfi_balance).toBe(Flavor.toBigN(250000).times(Flavor.toBigN(10**18)).times(Flavor.toBigN(1)).toString())

      let ampl_balance = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.ampl_pool.options.address).call();

      expect(ampl_balance).toBe(Flavor.toBigN(250000).times(Flavor.toBigN(10**18)).times(Flavor.toBigN(1)).toString())

      let eth_balance = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.eth_pool.options.address).call();

      expect(eth_balance).toBe(Flavor.toBigN(250000).times(Flavor.toBigN(10**18)).times(Flavor.toBigN(1)).toString())

      let snx_balance = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.snx_pool.options.address).call();

      expect(snx_balance).toBe(Flavor.toBigN(250000).times(Flavor.toBigN(10**18)).times(Flavor.toBigN(1)).toString())

      let comp_balance = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.comp_pool.options.address).call();

      expect(comp_balance).toBe(Flavor.toBigN(250000).times(Flavor.toBigN(10**18)).times(Flavor.toBigN(1)).toString())

      let lend_balance = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.lend_pool.options.address).call();

      expect(lend_balance).toBe(Flavor.toBigN(250000).times(Flavor.toBigN(10**18)).times(Flavor.toBigN(1)).toString())

      let link_balance = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.link_pool.options.address).call();

      expect(link_balance).toBe(Flavor.toBigN(250000).times(Flavor.toBigN(10**18)).times(Flavor.toBigN(1)).toString())

      let mkr_balance = await Flavor.contracts.Flavor.methods.balanceOf(Flavor.contracts.mkr_pool.options.address).call();

      expect(mkr_balance).toBe(Flavor.toBigN(250000).times(Flavor.toBigN(10**18)).times(Flavor.toBigN(1)).toString())

    });

    test("total supply", async () => {
      let ts = await Flavor.contracts.Flavor.methods.totalSupply().call();
      expect(ts).toBe("10500000000000000000000000")
    });

    test("init supply", async () => {
      let init_s = await Flavor.contracts.Flavor.methods.initSupply().call();
      expect(init_s).toBe("10500000000000000000000000000000")
    });
  });

  describe("contract ownership", () => {

    test("Flavor gov", async () => {
      let gov = await Flavor.contracts.Flavor.methods.gov().call();
      expect(gov).toBe(Flavor.contracts.timelock.options.address)
    });

    test("rebaser gov", async () => {
      let gov = await Flavor.contracts.rebaser.methods.gov().call();
      expect(gov).toBe(Flavor.contracts.timelock.options.address)
    });

    test("reserves gov", async () => {
      let gov = await Flavor.contracts.reserves.methods.gov().call();
      expect(gov).toBe(Flavor.contracts.timelock.options.address)
    });

    test("timelock admin", async () => {
      let gov = await Flavor.contracts.timelock.methods.admin().call();
      expect(gov).toBe(Flavor.contracts.gov.options.address)
    });

    test("gov timelock", async () => {
      let tl = await Flavor.contracts.gov.methods.timelock().call();
      expect(tl).toBe(Flavor.contracts.timelock.options.address)
    });

    test("gov guardian", async () => {
      let grd = await Flavor.contracts.gov.methods.guardian().call();
      expect(grd).toBe("0x0000000000000000000000000000000000000000")
    });

    test("pool owner", async () => {
      let owner = await Flavor.contracts.eth_pool.methods.owner().call();
      expect(owner).toBe(Flavor.contracts.timelock.options.address)
    });

    test("incentives owner", async () => {
      let owner = await Flavor.contracts.ycrv_pool.methods.owner().call();
      expect(owner).toBe(Flavor.contracts.timelock.options.address)
    });

    test("pool rewarder", async () => {
      let rewarder = await Flavor.contracts.eth_pool.methods.rewardDistribution().call();
      expect(rewarder).toBe(Flavor.contracts.timelock.options.address)
    });
  });

  describe("timelock delay initiated", () => {
    test("timelock delay initiated", async () => {
      let inited = await Flavor.contracts.timelock.methods.admin_initialized().call();
      expect(inited).toBe(true);
    })
  })
})
