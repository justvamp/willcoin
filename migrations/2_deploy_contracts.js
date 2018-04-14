var ConvertLib = artifacts.require("./ConvertLib.sol");
var WillCoin = artifacts.require("./WillCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, WillCoin);
  deployer.deploy(WillCoin);
};
