const manufacturer = artifacts.require("ManufacturerContract");
const product = artifacts.require("ProductContract");
const supplier = artifacts.require("SupplierContract");
const shop = artifacts.require("ShopContract");


module.exports = function(deployer) {
    deployer.deploy(manufacturer);
    deployer.deploy(product);
    deployer.deploy(supplier);
    deployer.deploy(shop);    
};