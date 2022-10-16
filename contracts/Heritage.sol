// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract Heritage {
    uint internal number;

    function setNumber(uint _number) external {
        number = _number;
    }
}

contract Enfant is Heritage {
    function getNumber() external view returns(uint) {
        return number;
    }
}

contract Caller {
    Enfant enfant = new Enfant();

    function getTheNumber(uint _number) public returns(uint) {
        enfant.setNumber(_number);
        return enfant.getNumber();
    }
}