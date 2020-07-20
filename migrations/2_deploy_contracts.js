const StorageMarket = artifacts.require("StorageMarketPlace");
const TestnetDAI = artifacts.require("TestnetDAI");

module.exports = function(deployer) {
    deployer.deploy(StorageMarket, BigInt(2000 * 10 ** 18).toString());
    deployer.deploy(TestnetDAI);
};
