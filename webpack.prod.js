const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    externals: {
        config: JSON.stringify({
            networkId: 4,
            marketAddress: "0xaad639b52aa20aa5147014e9bfb1856b3a429d98",
            priceAssets: [
                {
                    address: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8",
                    symbol: "DAI"
                }
            ]
        })
    }
});
