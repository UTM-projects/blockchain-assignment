const Migrations = artifacts.require("Migrations");

module.exports = async function(deployer) {
  console.log("Deploying Migrations contract...");
  try {
    await deployer.deploy(Migrations);
    console.log("Migrations contract deployed successfully.");
  } catch (error) {
    console.log("Error deploying Migrations contract:", error);
  }
  
};
