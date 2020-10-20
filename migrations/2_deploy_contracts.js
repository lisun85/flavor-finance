const USDCToken = artifacts.require("USDCToken");
const FlavoerToken = artifacts.require("FlavorToken");
const FlavorTest = artifacts.require("FlavorTest");

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock DAI Token
  await deployer.deploy(FlavoerToken);
  const flavoerToken = await FlavoerToken.deployed();

  // Deploy Dapp Token
  await deployer.deploy(USDCToken);
  const usdcToken = await USDCToken.deployed();

  // Deploy TokenFarm
  await deployer.deploy(FlavorTest, usdcToken.address, flavoerToken.address);
  const flavorTest = await FlavorTest.deployed();

  // Transfer all tokens to TokenFarm (1 million)
  await flavoerToken.transfer(flavorTest.address, "1000000000000000000000000");

  // Transfer 100 Mock DAI tokens to investor
  //await daiToken.transfer(accounts[1], '100000000000000000000')
};
