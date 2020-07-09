const StorageMarket = artifacts.require("StorageMarket");

module.exports = function(deployer) {
    deployer.deploy(StorageMarket, 20);
};
