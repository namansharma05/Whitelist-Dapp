//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist{
    uint8 maxWhitelistedAddresses;

    uint8 public numAddressesWhitelisted;

    mapping(address => bool) whitelistedAddresses;

    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddresseToWhitelist() public {
        require(!whitelistedAddresses[msg.sender],"Sender is already whitelisted");
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "Max limit reached");
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted++;
    }
}