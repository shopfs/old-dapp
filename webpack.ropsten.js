const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    devServer: {
    historyApiFallback: true,
    hot: true,
    host: "0.0.0.0",
    port: 3000
    },
    externals: {
        config: JSON.stringify({
            networkId: 3,
            marketAddress: "0x08a7c6d9ec99aefb45313994154c31604b8161ed",
            testnetDaiAddress: "0x2d69ad895797c880abce92437788047ba0eb7ff6"
        })
    }
});
