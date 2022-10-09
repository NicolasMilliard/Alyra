// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

contract People {

    struct Person {
        string name;
        uint age;
    }

    Person[] public persons;

    function add(string calldata _name, uint _age) public {
        persons.push(Person(_name, _age));
    }

    function remove() public {
        persons.pop();
    }

}