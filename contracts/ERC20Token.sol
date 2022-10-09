// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    // ERC20 called the ERC20 constructor with two parameters: name and symbol
    constructor(uint256 initialSupply) ERC20("Alyra", "ALY") {
        _mint(msg.sender, initialSupply);
    }

}