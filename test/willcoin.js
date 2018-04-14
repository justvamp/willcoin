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
    var geezer = accounts[0];
    var account_two = accounts[1];

    var geezer_starting_balance;
    var account_two_starting_balance;
    var geezer_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return WillCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(geezer);
    }).then(function(balance) {
      geezer_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.sendCoin(account_two, amount, {from: geezer});
    }).then(function() {
      return meta.getBalance.call(geezer);
    }).then(function(balance) {
      geezer_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(geezer_ending_balance, geezer_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });

  it("should set offsprings correctly", function() {
    var meta;

    var geezerAddress = accounts[0];
    var offspringAddress = accounts[1];

    var offspringInside;
    var moneyBagsInside;

    return WillCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.setOffspring(offspringAddress, {from: geezerAddress});
    }).then(function() {
      return meta.getOffspring.call(geezerAddress);
    }).then(function(offspring) {
      offspringInside = offspring;
      return meta.getMoneyBags.call(offspringAddress);
    }).then(function(moneybags) {
      moneyBagsInside = moneybags;
      assert.equal(offspringAddress, offspringInside, "Offspring written incorrectly");
      assert.equal(geezerAddress, moneyBagsInside[0], "Offspring written incorrectly");
    });
  });
});
