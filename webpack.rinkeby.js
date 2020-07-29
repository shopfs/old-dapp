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
            marketAddress: "0xc065c823ebeb500f292a8ae8f0f045f977209fda",
            testnetDAIAddress: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8"
        })
    }
});
