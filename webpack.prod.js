const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    externals: {
        config: JSON.stringify({
            networkId: 4,

            marketAddress: "0x7Fdee497283233794210F91093Ba85ceB90f9066",

            priceAssets: [
                {
                    address: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8",
                    symbol: "DAI"
                }
            ],
            subgraph: "https://api.thegraph.com/subgraphs/name/shopfs/market-rinkeby"
        })
    }
});
