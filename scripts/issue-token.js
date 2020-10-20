const FlavorTest = artifacts.require("FlavorTest");

module.exports = async function (callback) {
  let flavorTest = await FlavorTest.deployed();
  await flavorTest.issueTokens();
  // Code goes here...
  console.log("Tokens issued!");
  callback();
};
