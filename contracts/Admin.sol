// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Admin is Ownable {

    mapping(address => bool) whitelist;
    mapping(address => bool) blacklist;

    event Whitelisted (bool whitelisted);
    event Blacklisted (bool blacklisted);

    modifier checkAddressStatus(address _address) {
        require(!blacklist[_address], "This address is already blacklisted.");
        require(!whitelist[_address], "This address is already whitelisted.");
        _;
    }

    function allowAddress(address _address) public onlyOwner checkAddressStatus(_address) {
        whitelist[_address] = true;
        emit Whitelisted(true);
    }

    function banAddress(address _address) public onlyOwner checkAddressStatus(_address) {
        blacklist[_address] = true;
        emit Blacklisted(true);
    }

    function isWhitelisted(address _address) public view returns(bool) {
        return whitelist[_address];
    }

    function isBlacklisted(address _address) public view returns(bool) {
        return blacklist[_address];
    }

}