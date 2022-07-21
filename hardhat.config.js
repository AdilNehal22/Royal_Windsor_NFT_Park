require("@nomicfoundation/hardhat-toolbox");

/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
     rinkeby: {
       url: `https://rinkeby.infura.io/v3/daf2ac3c93d5408f8ae10fe67c9e9bca`,
       accounts: ['2559dc4667948dc3da2c84c96a22c5bd0364c04b2f2e796e3734d1dc1d61e711']
    }
  },
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}