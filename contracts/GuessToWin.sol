// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract GuessToWin {
    address owner;
    address winner;
    address[] playersAddress;

    string word;
    string public hint;

    mapping (address => bool) players;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner, "You're not the owner.");
        _;
    }

    function initGame(string memory _word, string memory _hint) public isOwner {
        word = _word;
        hint = _hint;
    }

    // playGame is possible only if no one has won the game and if the player haven't already played.    
    function playGame(string memory _proposal) public returns(bool) {
        require(winner == address(0), "Someone have already won the game.");
        require(players[msg.sender] == false, "You have already played.");

        players[msg.sender] = true;
        // Save player addres in an array. Needed for the reset.
        playersAddress.push(msg.sender);

        if(keccak256(abi.encode(word)) == keccak256(abi.encode(_proposal))) {
            winner = msg.sender;
            return true;
        } else {
            return false;
        }
    }

    function getWinner() public view returns(address) {
        require(winner != address(0), "No one has won the game yet.");
        return winner;
    }

    function resetGame() public isOwner {
        winner = address(0);
        word = "";
        hint = "";

        for(uint i = 0; i < playersAddress.length; i++) {
            players[playersAddress[i]] = false;
        }
    }
}