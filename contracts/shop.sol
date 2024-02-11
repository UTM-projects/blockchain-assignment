// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ShopContract {
    address payable public owner;
    // Incremental ID for each shop
    uint public shopId = 0;

    // Struct defining the Shop
    struct Shop {
        uint256 Id; // Unique identifier for the shop
        string Name; // Name of the shop
        string Address; // Address of the shop
        string Description; // Description of the shop
        address BCAddress; // Blockchain address of the shop
    }

    // Default null shop object
    Shop public nullShop = Shop(0, "", "", "", address(0));
    // Mapping to store shops with their IDs
    mapping(uint => Shop) public shops;

    // Event triggered when a new shop is added
    event ShopAdded(
        uint indexed Id,
        string Name,
        string Address,
        string Description,
        address BCAddress
    );

    constructor() {
    }

    // Function to add a new shop
    function addNewShop(string memory _name, string memory _address, string memory _description) public {
        // Incrementing shop ID
        shopId++;
        // Creating a new Shop object and storing it in the mapping
        shops[shopId] = Shop(shopId, _name, _address, _description, msg.sender);

        // Emitting an event to indicate the addition of a new shop
        emit ShopAdded(shopId, _name, _address, _description, msg.sender);
    }    

    // Function to check if an address belongs to a shop
    function isShop() public view returns (bool) {
        // Loop through existing shops
        for (uint i = 1; i <= shopId; i++) {
            // Check if the provided address matches any shop's address
            if (shops[i].BCAddress == msg.sender) {
                return true;
            }
        }
        return false;
    }

    // Function to retrieve a shop's details by their blockchain address
    function getShopByBCA(address bca) public view returns (Shop memory) {
        uint idx = 0;
        // Loop through existing shops
        for (uint i = 1; i <= shopId; i++) {
            // Find the shop with the provided blockchain address
            if (shops[i].BCAddress == bca) {
                idx = i;
            }
        }
        // Return the shop's details if found, otherwise return the nullShop
        return idx != 0 ? shops[idx] : nullShop;
    }
}