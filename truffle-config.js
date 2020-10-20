require("babel-register");
require("babel-polyfill");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          process.env.HDWALLET_MNEMONIC,
          `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
        );
      },
      network_id: 3,
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          process.env.HDWALLET_MNEMONIC,
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        );
      },
      network_id: 42,
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          process.env.HDWALLET_MNEMONIC,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
        );
      },
      network_id: 4,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "petersburg",
    },
  },
};
