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
            networkId: 4447,
            marketAddress: "0xCfEB869F69431e42cdB54A4F4f105C19C080A601",
            priceAssets: [
                {
                    address: "0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B",
                    symbol: "DAI"
                }
            ]
        })
    }
});
