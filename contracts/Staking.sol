// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Staking is Ownable {

    // address admin;
    uint firstTxTimestamp;
    uint txNumber;
    
    mapping(uint => uint) deposits;

    event txSaved(uint txNumber, uint value);

    // constructor() {
    //     admin = msg.sender;
    // }

    function deposit() public payable {
        if(firstTxTimestamp == 0) {
            firstTxTimestamp = block.timestamp;
        }

        deposits[txNumber] = msg.value;
        
        emit txSaved(txNumber, msg.value);

        txNumber++;
    }

    function withdraw() public payable onlyOwner {
        // require(msg.sender == admin, "You're not allowed to withdraw");
        // require(block.timestamp > firstTxTimestamp + (3 * 4 weeks) , "You have to wait three months.");
        require(block.timestamp > firstTxTimestamp + 1 minutes , "You have to wait one minute."); // Easier for testing

        // (bool success,) = admin.call{value: address(this).balance}("");
        (bool success,) = (msg.sender).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}