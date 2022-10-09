// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

contract Whitelist {

    mapping (address => bool) whitelist;

    event Authorized(address _address);

    constructor() {
        whitelist[msg.sender] = true;
    }

    modifier check() {
        require(whitelist[msg.sender] == true, "Your address is not whitelisted");
        _;
    }

    function authorized(address _address) public check {
        whitelist[_address] = true;

        emit Authorized(_address);
    }
}