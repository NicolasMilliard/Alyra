// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract SimpleStorage {
    uint256 number;

    function store(uint256 _number) public {
        require (_number != 0, "You can't use 0.");
        // number = _number;

        // if(_number == 0) {
        //     number = 100;
        // } else if(_number == 1) {
        //     number = 101;
        // } else {
        //     number = _number;
        // }

        uint increment = _number;
        uint limit = 12;

        // while (limit > increment) {
        //     increment += _number;
        // }
        // number = increment;

        // do {
        //     increment += _number;
        // } while (limit > increment);
        // number = increment;

        for(uint i = 0; i < 10; i++) {
            if(limit == increment) {
                increment++;
                continue;
            }
            increment += _number;
        }
        if(increment > 40) {
            revert(unicode"You went too far... éà");
        }
        number = increment;


    }

    function retrieve() public view returns(uint256) {
        return number;
    }
}