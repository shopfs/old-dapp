const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    externals: {
        config: JSON.stringify({
            networkId: 4,
            marketAddress: "0xcb3eaafa1a9335d2993c3021b8e089150a0233fd",
            priceAssets: [
                {
                    address: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8",
                    symbol: "DAI"
                }
            ]
        })
    }
});
