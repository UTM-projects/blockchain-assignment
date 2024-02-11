// translate product array from sol into an object
App.translateProduct = (arr) => {
    // Define the fields of a product, same as sol struct
    let prodFields = [
        "productId", "supplier", "productName", "productType",
        "quantity", "state", "productImage", "price", "manufacturer",
        "shop", "previousProductId", "timestamp"
    ];

    // Initialize an empty object
    let obj = {};
    // Map array elements to object keys
    prodFields.forEach((v, i) => obj[v] = arr[i]);
    // Cast numeric fields to number
    obj.productId = +obj.productId;
    obj.price = +obj.price;
    obj.previousProductId = +obj.previousProductId;
    obj.timestamp = +obj.timestamp;
    obj.quantity = +obj.quantity;

    return obj;
}

// Function to translate a seller (suppier/manufacturer/shop)
// from sol into an object
App.translateSeller = (arr) => {
    // Define the fields of a seller
    let prodFields = [
        "Id", "Name", "Address", "Description", "BCAddress"
    ];

    // Initialize an empty object
    let obj = {};
    // Map array elements to object keys
    prodFields.forEach((v, i) => obj[v] = arr[i]);
    // Convert the Id field to numeric type
    obj.Id = +obj.Id;
    return obj;
}

// Function to serialize the history of a product
App.serializeProductHistory = async (initialProductId) => {
    // Initialize an empty array to store product history
    let finalArr = [];
    // pointer to traverse the product chain
    let productPointer = initialProductId;
    do {
        // Fetch current product details
        let currProd = await App.products.products(productPointer);
        
        // Translate fetched product details into an object
        currProd = App.translateProduct(currProd);

        // Fetch seller details for the current product
        currProd.supplierObj = await App.getSellerByBCA('supplier', currProd.supplier);
        currProd.manufacturerObj = await App.getSellerByBCA('manufacturer', currProd.manufacturer);
        currProd.shopObj = await App.getSellerByBCA('shop', currProd.shop);

        // Add the current product to the product history array
        finalArr.push(currProd);
        // Update productPointer to fetch the previous product in the supply chain
        productPointer = currProd.previousProductId;
    } while (productPointer != 0)
    // Reverse array for correct chronological order
    return finalArr.reverse();
}

// Function to fetch seller details by their blockchain address
App.getSellerByBCA = async (sellerType, SellerBCA) => {
    // Determine contract and collection
    let contract = App[sellerType];
    let coll = `${sellerType}s`;
    // Get the total number of sellers of the given type
    let numSellers = +(await contract[`${sellerType}Id`]());
    // Initialize an array to store fetched sellers
    let sellers = [...new Array(numSellers)];
    // Fetch seller details asynchronously
    sellers = sellers.map(async (el, idx) => {
        let seller_id = idx + 1;
        let seller = await contract[coll](seller_id);
        return seller;
    });

    // Wait for all seller details to be fetched
    sellers = await Promise.all(sellers);
    // Translate each fetched seller into an object
    sellers = sellers.map(s => App.translateSeller(s));
    // Filter the seller with the provided blockchain address
    let finalSeller = sellers.filter(x => x.BCAddress == SellerBCA);
    // Return the final seller object if found, otherwise return false
    finalSeller = finalSeller.length ? finalSeller[0] : false;
    return finalSeller;
}