const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        port: 8000,
        open: true,
        hot: true,
        liveReload: true,
        historyApiFallback: true,
        static: "./src",
    },
    // On ne remet PAS de section module ici car elle est déjà dans common
});