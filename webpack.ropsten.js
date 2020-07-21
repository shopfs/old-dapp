const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    externals: {
        config: JSON.stringify({
            networkId: 3,
            marketAddress: "0xa9d88865d90320162cd04af1a8cd2cc6fc78b9f2",
            testnetDaiAddress: "0x2d69ad895797c880abce92437788047ba0eb7ff6"
        })
    }
});
