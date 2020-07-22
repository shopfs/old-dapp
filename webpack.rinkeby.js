const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    externals: {
        config: JSON.stringify({
            networkId: 4,
            marketAddress: "0x7242c8b2ab83d3dc62ab4a4a2e5bd44577d5b94d",
            testnetDaiAddress: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8"
        })
    }
});
