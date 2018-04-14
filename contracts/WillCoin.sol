pragma solidity ^0.4.18;

contract WillCoin {

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

	function transferCoin(address from, address to, uint amount) private returns(bool sufficient) {
		if (balances[from] < amount) return false;
		balances[from] -= amount;
		balances[to] += amount;
		emit Transfer(from, to, amount);
		return true;
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		bringMeToLife();
		return transferCoin(msg.sender, receiver, amount);
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

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}

	function getOffspring(address addr) public view returns(address) {
		return offsprings[addr];
	}

	function getMoneyBags(address addr) public view returns(address[]) {
		return moneybags[addr];
	}

	function getLastActiveBlock(address addr) public view returns(uint) {
		return lastActiveBlocks[addr];
	}

	function performLastWill() public {
		sendCoin(offsprings[msg.sender], balances[msg.sender]);
	}

	function bringMeToLife() public {
		lastActiveBlocks[msg.sender] = block.number;
	}

	function emptyMoneyBag(address moneybag) public returns(bool successful) {
		if (offsprings[moneybag] == msg.sender && (block.number > lastActiveBlocks[moneybag] + blocksTillWill[moneybag])) {
			return transferCoin(moneybag, msg.sender, balances[moneybag]);
		}
		return false;
	}
}
