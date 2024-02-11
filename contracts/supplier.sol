// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplierContract {
    address payable public owner;
    // int property to track number of suppliers
    uint public supplierId = 0;

    // main structure of a supplier record
    struct Supplier {
        uint256 Id;
        string Name;
        string Address;
        string Description;
        address BCAddress;
    }

    // null supplier object to send
    Supplier public nullSupplier = Supplier(0,"","","",address(0));

    // mapping to store supplier objects
    mapping(uint => Supplier) public suppliers;

    // Event triggered when a new supplier is added
    event SupplierAdded(
        uint indexed Id,
        string Name,
        string Address,
        string Description,
        address BCAddress
    );

    // check if an account is a supplier
    event supplierCheck(bool isSupp);

    // Generic logger event
    event Logger(
        string msg
    );


    constructor() {
    }

    // adding a supplier object from the front end
    function addNewSupplier(string memory _name, string memory _address, string memory _description) public {
        supplierId++; // Increment the supplier count and
        // add the new supplier details to our mapping storage
        suppliers[supplierId] = Supplier(supplierId, _name, _address, _description, msg.sender);

        // Emit The event to notify of successful addition
        emit SupplierAdded(supplierId, _name, _address, _description, msg.sender);
    }

    // This method will be used to check if a specific address is a supplier
    // By checking in the mapping if we have a supplier with the same adress. 
    function isSupplier() public view returns (bool) {
        for (uint i = 1; i <= supplierId; i++) {
            if (suppliers[i].BCAddress == msg.sender) {
                return true;
            }
        }
        // If no supplier found with same address, return false
        return false;
    }

    // Retrieve a supplier from the mapping using their Blockchain address
    function getSupplierByBCA(address bca) public view returns (Supplier memory) {
        
        uint idx = 0;
        for (uint i = 1; i <= supplierId; i++) {
            if (suppliers[i].BCAddress == bca) {
                idx = i;
            }
        }
        // Return either the supplier if found, null if not
        return idx!=0 ? suppliers[idx] : nullSupplier;
    }

    // Generic logging function to send data to client
    function log(string memory str) public {
        emit Logger(str);
    }
}
