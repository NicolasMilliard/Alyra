// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract Random {
    // CONTRACT NOT SECURE -- DO NOT USE IN PRODUCTION
    uint nonce;

    function randomNumber() public returns(uint number) {
        number = uint(keccak256(abi.encode(block.timestamp, nonce))) % 100;
        nonce++;
        return number;
    }
}