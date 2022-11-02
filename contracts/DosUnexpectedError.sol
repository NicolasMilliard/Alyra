// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;
 
contract Auction {
    address highestBidder;
    uint highestBid;

    mapping(address => uint) credits;
 
    function bid() payable public {
        require(msg.value >= highestBid);
 
        if (highestBidder != address(0)) {
            // (bool success, ) = highestBidder.call{value:highestBid}("");
            // require(success); // if this call consistently fails, no one else can bid
            credits[highestBidder] += highestBid; // record the refund that this user can claim
        }
 
       highestBidder = msg.sender;
       highestBid = msg.value;
    }

    function withdraw() public payable {
        uint refund = credits[msg.sender];
        credits[msg.sender] = 0;
        (bool success,) = msg.sender.call{value: refund}("");
        require(success);
    }
}

contract DosUnexpectedError {
    Auction public auction;

    constructor(address _auction) {
        auction = Auction(_auction);
    }

    function wreck() external payable {
        auction.bid{value: msg.value}();
    }
}