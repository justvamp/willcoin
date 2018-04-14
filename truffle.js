// More options here: http://truffleframework.com/docs/advanced/configuration
module.exports = {
  networks: {
    dev: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    },
    testnet: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      from: "0x0000000000..."
    }
  }
};
