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
            marketAddress: "0xaad639b52aa20aa5147014e9bfb1856b3a429d98",
            testnetDAIAddress: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8"
        })
    }
});
