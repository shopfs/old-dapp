const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        historyApiFallback: true,
        hot: true,
        host: "localhost",
        port: 3000
    },
    externals: {
        config: JSON.stringify({
            networkId: 4,
            marketAddress: "0x6e769470f6f8d99794e53c87fd8254e5d4fedb8b",
            testnetDAIAddress: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8"
        })
    }
});
