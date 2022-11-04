// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

contract Fallback {
    mapping (address => uint) balances;

    event complyCall(address _address, uint _amount);
    event nonComplyCall(address _address);

    function deposit() external payable {
        balances[msg.sender] += msg.value;

        emit complyCall(msg.sender, msg.value);
    }

    receive() external payable {
        emit complyCall(msg.sender, msg.value);
    }

    fallback() external payable {
        require(msg.data.length == 0, "Non comply call.");
        emit nonComplyCall(msg.sender);
    }
}