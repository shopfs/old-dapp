const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    externals: {
        config: JSON.stringify({
            networkId: 4,
            marketAddress: "0x45d6508f457584e5b613320ecd881cce835698b9",
            testnetDaiAddress: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8"
        })
    }
});
