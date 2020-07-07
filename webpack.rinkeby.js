const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "rinkeby",
    devtool: "source-map",
    externals: {
        config: JSON.stringify({
            networkId: 4,
            contractAddress: "<INSERT RINKEBY CONTRACT ADDRESS"
        })
    }
});
