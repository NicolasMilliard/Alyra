// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract Bank {
    mapping(address => uint) balances;

    function deposit(uint _amount) public {
        balances[msg.sender] += _amount;
    }

    function transfer(address _to, uint _amount) public {
        // We can't transfer to 0x000 address
        require(_to != address(0), "You can't burn your tokens.");
        // We can't transfer an amount greater than our own amount
        require(balances[msg.sender] >= _amount, "You don't have enough funds to complete transfer");

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function balanceOf(address _address) public view returns(uint) {
        return balances[_address];
    }
}