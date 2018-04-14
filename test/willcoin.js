var WillCoin = artifacts.require("./WillCoin.sol");

contract('WillCoin', function(accounts) {
  it("should put 10000 WillCoin in the first account", function() {
    return WillCoin.deployed().then(function(instance) {
      return instance.getBalance.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  });

  it("should call a function that depends on a linked library", function() {
    var meta;
    var willCoinBalance;
    var willCoinEthBalance;

    return WillCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(accounts[0]);
    }).then(function(outCoinBalance) {
      willCoinBalance = outCoinBalance.toNumber();
      return meta.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      willCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(willCoinEthBalance, 2 * willCoinBalance, "Library function returned unexpected function, linkage may be broken");
    });
  });

  it("should send coin correctly", function() {
    var meta;

    // Get initial balances of first and second account.
    var geezerAddress = accounts[0];
    var offspringAddress = accounts[1];

    var geezerStartingBalance;
    var geezerEndingBalance;
    var offspringStartingBalance;
    var offspringEndingBalance;

    var amount = 10;

    return WillCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(geezerAddress);
    }).then(function(balance) {
      geezerStartingBalance = balance.toNumber();
      return meta.getBalance.call(offspringAddress);
    }).then(function(balance) {
      offspringStartingBalance = balance.toNumber();
      return meta.sendCoin(offspringAddress, amount, {from: geezerAddress});
    }).then(function() {
      return meta.getBalance.call(geezerAddress);
    }).then(function(balance) {
      geezerEndingBalance = balance.toNumber();
      return meta.getBalance.call(offspringAddress);
    }).then(function(balance) {
      offspringEndingBalance = balance.toNumber();

      assert.equal(geezerEndingBalance, geezerStartingBalance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(offspringEndingBalance, offspringStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });

  it("should set an offspring correctly and perform the last will", function() {
    var meta;

    var geezerAddress = accounts[0];
    var offspringAddress = accounts[1];

    var geezerStartingBalance;
    var geezerEndingBalance;
    var offspringStartingBalance;
    var offspringEndingBalance;

    var offspringInside;
    var moneyBagsInside;

    return WillCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(geezerAddress);
    }).then(function(balance) {
      geezerStartingBalance = balance.toNumber();
      return meta.getBalance.call(offspringAddress);
    }).then(function(balance) {
      offspringStartingBalance = balance.toNumber();
      return meta.setOffspring(offspringAddress, {from: geezerAddress});
    }).then(function() {
      return meta.getOffspring.call(geezerAddress);
    }).then(function(offspring) {
      offspringInside = offspring;
      return meta.getMoneyBags.call(offspringAddress);
    }).then(function(moneybags) {
      moneyBagsInside = moneybags;
      return meta.performLastWill();
    }).then(function() {
      return meta.getBalance.call(geezerAddress);
    }).then(function(balance) {
      geezerEndingBalance = balance.toNumber();
      return meta.getBalance.call(offspringAddress);
    }).then(function(balance) {
      offspringEndingBalance = balance.toNumber();

      assert.equal(offspringAddress, offspringInside, "Offspring written incorrectly");
      assert.equal(geezerAddress, moneyBagsInside[0], "Moneybag written incorrectly");
      assert.equal(geezerEndingBalance, 0);
      assert.equal(offspringEndingBalance, geezerStartingBalance + offspringStartingBalance);
    });
  });
});
