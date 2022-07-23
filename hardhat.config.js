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
       url: `https://rinkeby.infura.io/v3/${process.env.infuraID}`,
       accounts: [process.env.privateKey]
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