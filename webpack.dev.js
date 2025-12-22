const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "development",

    devServer: {
        port: 3000,
        host: "0.0.0.0",
        open: false,
        hot: true,
        liveReload: true,
        historyApiFallback: true,
        allowedHosts: "all",
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env.API_URL": JSON.stringify(process.env.API_URL || "http://localhost:8080/api"),
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            favicon: "./src/assets/favicon.svg",
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
});
