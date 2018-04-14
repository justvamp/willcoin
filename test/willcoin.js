var WillCoin = artifacts.require("./WillCoin.sol");

contract('WillCoin', function(accounts) {
  it("should put 10000 WillCoin in the first account", function() {
    return WillCoin.deployed().then(function(instance) {
      return instance.getBalance.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  });

  it("should send coin correctly", function() {
    var meta;

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
      assert.equal(geezerEndingBalance, 0, "Money weren't properly transferred from moneybag");
      assert.equal(offspringEndingBalance, geezerStartingBalance + offspringStartingBalance, "Money weren't properly transferred to offspring");
    });
  });

  it("should bring to life", function() {
    var meta;
    var lastActiveBlock;

    var geezerAddress = accounts[0];

    return WillCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.bringMeToLife.call({from: geezerAddress});
    }).then(function() {
      return meta.getLastActiveBlock.call(geezerAddress);
    }).then(function(block) {
      lastActiveBlock = block.toNumber();
      // TODO: think of how to check it properly
      //assert.equal(lastActiveBlock, 8, "Last active block wasn't set correctly");
    });
  });

  it("should set and get blocks till will", function() {
    var meta;

    var geezerAddress = accounts[0];
    var offspringAddress = accounts[1];

    var defaultBlocksTillWill;
    var blocksToSet = 16000000;
    var blocksInside;

    return WillCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.setOffspring(offspringAddress, {from: geezerAddress});
    }).then(function() {
      return meta.getBlocksTillWill.call(geezerAddress);
    }).then(function(blocks) {
      defaultBlocksTillWill = blocks.toNumber();
      return meta.setBlocksTillWill(blocksToSet);
    }).then(function() {
      return meta.getBlocksTillWill.call(geezerAddress);
    }).then(function(blocks) {
      blocksInside = blocks.toNumber();

      assert.equal(defaultBlocksTillWill, 2102400, "Default blocks till will was written incorrectly");
      assert.equal(blocksInside, blocksToSet, "Blocks till will was written incorrectly");
    });
  });

  it("it should empty moneybag", function() {
    var meta;

    var geezerAddress = accounts[0];
    var offspringAddress = accounts[1];

    var geezerStartingBalance;
    var geezerEndingBalance;
    var offspringStartingBalance;
    var offspringEndingBalance;

    var emptyResult;

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
      return meta.setBlocksTillWill(0); // some small amount
    }).then(function() {
      return meta.emptyMoneyBag(geezerAddress, {from: offspringAddress});
    }).then(function() {
      return meta.getBalance.call(geezerAddress);
    }).then(function(balance) {
      geezerEndingBalance = balance.toNumber();
      return meta.getBalance.call(offspringAddress);
    }).then(function(balance) {
      offspringEndingBalance = balance.toNumber();

      assert.equal(geezerEndingBalance, 0, "Money weren't properly emptied from moneybag");
      assert.equal(offspringEndingBalance, geezerStartingBalance + offspringStartingBalance, "Money weren't properly emptied to offspring");
    });
  });

  it("it should not empty moneybag because it's too early", function() {
    var meta;

    var geezerAddress = accounts[0];
    var offspringAddress = accounts[1];

    var geezerStartingBalance;
    var geezerEndingBalance;
    var offspringStartingBalance;
    var offspringEndingBalance;

    var emptyResult;

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
      return meta.setBlocksTillWill(1000); // some big amount
    }).then(function() {
      return meta.emptyMoneyBag(geezerAddress, {from: offspringAddress});
    }).then(function() {
      return meta.getBalance.call(geezerAddress);
    }).then(function(balance) {
      geezerEndingBalance = balance.toNumber();
      return meta.getBalance.call(offspringAddress);
    }).then(function(balance) {
      offspringEndingBalance = balance.toNumber();

      assert.equal(geezerEndingBalance, geezerStartingBalance, "Moneybag's money weren't left as they should be");
      assert.equal(offspringEndingBalance, offspringStartingBalance, "Offspring's money weren't left as they should be");
    });
  });

  it("it should not empty moneybag because of wrong emptier", function() {
    var meta;

    var geezerAddress = accounts[0];
    var offspringAddress = accounts[1];
    var emptierAddress = accounts[2];

    var geezerStartingBalance;
    var geezerEndingBalance;
    var offspringStartingBalance;
    var offspringEndingBalance;

    var emptyResult;

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
      return meta.setBlocksTillWill(0); // some small amount
    }).then(function() {
      return meta.emptyMoneyBag(geezerAddress, {from: emptierAddress}); // wrong emptier address (attack imitation)
    }).then(function() {
      return meta.getBalance.call(geezerAddress);
    }).then(function(balance) {
      geezerEndingBalance = balance.toNumber();
      return meta.getBalance.call(offspringAddress);
    }).then(function(balance) {
      offspringEndingBalance = balance.toNumber();

      assert.equal(geezerEndingBalance, geezerStartingBalance, "Moneybag's money weren't left as they should be");
      assert.equal(offspringEndingBalance, offspringStartingBalance, "Offspring's money weren't left as they should be");
    });
  });

});
