// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PFP is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    struct Pfp {
        uint size;
        string hair;
    }

    Pfp[] pfps;

    constructor() ERC721("Nico PFP", "NICO") {}

    function mintPfp(address _to, string calldata _tokenURI, uint _size, string calldata _hair) external returns(uint) {
        // Token ID start at one
        _tokenIds.increment();

        pfps.push(Pfp(_size, _hair));
        uint newTokenId = _tokenIds.current();

        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        return newTokenId;
    }
}