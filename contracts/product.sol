// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductContract {
    // Variable to track the number of products
    uint public productCount = 0;

    // Define the product structure
    struct Product {
        uint productID; // Unique identifier for the product
        address payable supplier; // Address of the supplier
        string productName; // Name of the product
        string productType; // Type of the product
        uint256 quantity; // Quantity of the product
        string state; // State of the product (Raw, InProcess, Finished, Sold)
        string productImage; // Image of the product
        uint price; // Price of the product
        address payable manufacturer; // Address of the manufacturer
        address payable shop; // Address of the shop
        uint previousProductId; // ID of the previous product in the supply chain
        uint timestamp; // Timestamp of when the product was added
    }

    // Mapping to store products with a unique reference
    mapping(uint => Product) public products;

    // Event triggered when a new product is added
    event ProductAdded(uint productId, address supplier, string productName, string productType, uint256 quantity, string state, string productImage, uint price, uint previousProductId);
    
    // Event triggered when a new product is added by a manufacturer
    event ManufacturerProductAdded(uint productId, address supplier, string productName, string productType, uint256 quantity, string state, string productImage, uint price, uint previousProductId);
    
    // Event triggered when a new product is added by a manufacturer
    event FinalProductAdded(uint productId, address supplier, string productName, string productType, uint256 quantity, string state, string productImage, uint price, uint previousProductId, address manufacturer);
    
    // Event triggered when the product state is updated
    event ProductUpdated(bytes32 productId, address manufacturer, string state);
    
    // Event to list products
    event ProductList(Product[] list);
    
    // Event triggered when a shop purchases a product
    event ProductPurchased(bytes32 productId, address shop);
    
    // Event to log messages
    event logger(string message);
    
    // Event to view product
    event ViewProduct(Product p);

    // Function for the supplier to add raw products
    function addRawProduct(string memory productName, string memory productType, uint256 quantity, string memory productImage, uint price) public {
        productCount++;
        uint productId = productCount;

        // Creating a new Product object for raw product
        products[productId] = Product({
            productID: productId,
            supplier: payable(msg.sender),
            productName: productName,
            productType: productType,
            quantity: quantity,
            state: "Raw",
            productImage: productImage,
            price: price,
            manufacturer: payable(address(0)),
            shop: payable(address(0)),
            previousProductId: 0,
            timestamp: block.timestamp
        });

        // Emitting an event to indicate the addition of a raw product
        emit ProductAdded(productId, msg.sender, productName, productType, quantity, "Raw", productImage, price, 0);
        emit logger("Inside addRawProduct");
    }

    // Function to list products based on their state
    function getProductListByState(string memory state) public returns (Product[] memory) {
        Product[] memory list = new Product[](productCount);
        for (uint i = 0; i <= productCount; i++) {
            Product memory p = products[i];
            if (keccak256(bytes(p.state)) == keccak256(bytes(state))) {
                list[i] = products[i];
            }
        }
        // Emitting an event to indicate the list of products based on state
        emit ProductList(list);
        return list;
    }

    // Add manufacturer products
    function addManufacturerProduct(string memory productName, string memory productType, uint256 quantity, string memory productImage, uint price, address previousSupplier, uint previousProductId) public {
        productCount++;
        uint productId = productCount;

        // Creating a new Product object for manufacturer product
        products[productId] = Product({
            productID: productId,
            supplier: payable(previousSupplier),
            productName: productName,
            productType: productType,
            quantity: quantity,
            state: "InProcess",
            productImage: productImage,
            price: price,
            manufacturer: payable(msg.sender),
            shop: payable(address(0)),
            previousProductId: previousProductId,
            timestamp: block.timestamp
        });

        // Emitting an event to indicate the addition of a manufacturer product
        emit ManufacturerProductAdded(productId, previousSupplier, productName, productType, quantity, "InProcess", productImage, price, previousProductId);
        emit logger("Inside addManufacturerProduct");
    }

    // Add shop products
    function addFinalProduct(string memory productName, string memory productType, uint256 quantity, string memory productImage, uint price, address previousSupplier, uint previousProductId, address previousManufacturer) public {
        productCount++;
        uint productId = productCount;

        // Creating a new Product object for final product
        products[productId] = Product({
            productID: productId,
            supplier: payable(previousSupplier),
            productName: productName,
            productType: productType,
            quantity: quantity,
            state: "Finished",
            productImage: productImage,
            price: price,
            manufacturer: payable(previousManufacturer),
            shop: payable(msg.sender),
            previousProductId: previousProductId,
            timestamp: block.timestamp
        });

        // Emitting an event to indicate the addition of a final product
        emit FinalProductAdded(productId, previousSupplier, productName, productType, quantity, "Finished", productImage, price, previousProductId, previousManufacturer);
        emit logger("Inside addManufacturerProduct");
    }

    // Function to view product details
    function viewProduct(uint productId) public view returns (
        address supplier,
        string memory productName,
        string memory productType,
        uint256 quantity,
        string memory state,
        string memory productImage,
        uint price,
        address manufacturer,
        address shop
    ) {
        Product memory product = products[productId];
        return (
            product.supplier,
            product.productName,
            product.productType,
            product.quantity,
            product.state,
            product.productImage,
            product.price,
            product.manufacturer,
            product.shop
        );
    }

    // Function for a shop to purchase a product
    function buyFromShop(uint productId) public payable returns (bool) {
        // Fetching product details
        Product memory prod = products[productId];

        // Updating product state to "Sold"
        prod.state = "Sold";

        // Emitting event to indicate product purchased
        emit ViewProduct(prod);

        return true;
    }
}