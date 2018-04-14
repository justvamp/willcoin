pragma solidity ^0.4.18;

import "./ConvertLib.sol";

contract WillCoin {
	struct fortune {
		address moneybag;
		uint blocksRemaining;
	}

	mapping (address => uint) balances;
	mapping (address => address) offsprings;
	mapping (address => address[]) moneybags;
	mapping (address => uint) lastActiveBlocks;
	mapping (address => uint) blocksTillWill;

	event Transfer(address indexed _from, address indexed _to, uint _value);

	event Offspring(address indexed _moneybag, address indexed _offspring);

	function WillCoin() public {
		balances[tx.origin] = 10000;
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		bringMeToLife();
		emit Transfer(msg.sender, receiver, amount);
		return true;
	}

	function setOffspring(address addr) public {
		offsprings[msg.sender] = addr;
		moneybags[addr].push(msg.sender);
		bringMeToLife();
		setBlocksTillWill(2102400);
		emit Offspring(msg.sender, addr);
	}

	function setBlocksTillWill(uint blocksNumber) public {
		blocksTillWill[msg.sender] = blocksNumber;
	}

	function getBlocksTillWill(address addr) public view returns(uint) {
		return blocksTillWill[addr];
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

	function getMoneyBags(address addr) public view returns(address[]) {
		return moneybags[addr];
	}

	function performLastWill() public {
		sendCoin(offsprings[msg.sender], balances[msg.sender]);
	}

	function bringMeToLife() public {
		lastActiveBlocks[msg.sender] = block.number;
	}

	function getLastActiveBlock(address addr) public view returns(uint) {
		return lastActiveBlocks[addr];
	}

	//makeMeRich
}
