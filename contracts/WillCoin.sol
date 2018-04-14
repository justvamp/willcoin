pragma solidity ^0.4.18;

import "./ConvertLib.sol";

contract WillCoin {
	mapping (address => uint) balances;
	mapping (address => address) offsprings;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	event OffspringSet(address indexed _geezer, address indexed _offspring);

	function WillCoin() public {
		balances[tx.origin] = 10000;
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		emit Transfer(msg.sender, receiver, amount);
		return true;
	}

	function setOffspring(address addr) public {
		offsprings[msg.sender] = addr;
		emit OffspringSet(msg.sender, addr);
	}

	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr), 2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}

	function getOffspring(address addr) public view returns(address) {
		return offsprings[addr];
	}
}
