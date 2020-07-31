const StorageMarket = artifacts.require("StorageMarketPlace");

module.exports = function(deployer) {
    deployer.deploy(StorageMarket, BigInt(2000 * 10 ** 18).toString());
};
