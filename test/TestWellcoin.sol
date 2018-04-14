pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/WillCoin.sol";

contract TestWillCoin {

  function testInitialBalanceUsingDeployedContract() public {
    WillCoin meta = WillCoin(DeployedAddresses.WillCoin());

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 WillCoin initially");
  }

  function testInitialBalanceWithNewWillCoin() public {
    WillCoin meta = new WillCoin();

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 WillCoin initially");
  }

}
