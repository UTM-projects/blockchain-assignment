// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ManufacturerContract {
    // Address of the contract owner
    address payable public owner;
    
    // Incremental ID for each manufacturer
    uint public manufacturerId = 0;

    // Struct defining the Manufacturer
    struct Manufacturer {
        uint256 Id; // Unique identifier for the manufacturer
        string Name; // Name of the manufacturer
        string Address; // Address of the manufacturer
        string Description; // Description of the manufacturer
        address BCAddress; // Blockchain address of the manufacturer
    }

    // Default null manufacturer object
    Manufacturer public nullManufacturer = Manufacturer(0, "", "", "", address(0));

    // Mapping to store manufacturers with their IDs
    mapping(uint => Manufacturer) public manufacturers;

    // Event triggered when a new manufacturer is added
    event ManufacturerAdded(
        uint indexed Id,
        string Name,
        string Address,
        string Description,
        address BCAddress
    );

    // Event triggered to check if an address belongs to a manufacturer
    event manufacturerCheck(bool isMan);

    constructor() {
    }

    // Function to add a new manufacturer to the mapping
    function addNewManufacturer(string memory _name, string memory _address, string memory _description) public {
        // Incrementing manufacturer ID
        manufacturerId++;
        // Creating a new Manufacturer object and storing it in the mapping
        manufacturers[manufacturerId] = Manufacturer(manufacturerId, _name, _address, _description, msg.sender);

        // Emitting an event to indicate the addition of a new manufacturer
        emit ManufacturerAdded(manufacturerId, _name, _address, _description, msg.sender);
    }

    // Function to check if an address belongs to a manufacturer
    function isManufacturer() public view returns (bool) {
        // Loop through existing manufacturers
        for (uint i = 1; i <= manufacturerId; i++) {
            // Check if the provided address matches any manufacturer's address
            if (manufacturers[i].BCAddress == msg.sender) {
                return true;
            }
        }
        return false;
    }

    // Function to retrieve a manufacturer's details by their blockchain address
    function getManufacturerByBCA(address bca) public view returns (Manufacturer memory) {
        uint idx = 0;
        // Loop through existing manufacturers
        for (uint i = 1; i <= manufacturerId; i++) {
            // Find the manufacturer with the provided blockchain address
            if (manufacturers[i].BCAddress == bca) {
                idx = i;
            }
        }
        // Return the manufacturer's details if found, otherwise return the nullManufacturer
        return idx != 0 ? manufacturers[idx] : nullManufacturer;
    }
}
