const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const html_plugin = require("html-webpack-plugin");
const css_plugin = require("mini-css-extract-plugin")

module.exports = merge(common, {
    mode: "production",
    
    plugins: [
        new html_plugin({
            template: "./frontend/index.html",
            filename: "index.html",
            favicon: "./frontend/assets/favicon.svg"
        }),
        new css_plugin({
            filename: "styles.css"
        })
    ],

    module: {
        rules: [
            {
                test: /\.(js|ts|jsx|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript"
                        ]
                    }
                }
            },

            {
                test: /\.css$/,
                use: [css_plugin.loader, "css-loader"]
            },

            {
                test: /\.(png|svg)$/,
                type: "asset/resource",
                generator: {
                    filename: "images/[name][hash][ext]"
                }
            }
        ]
    }
});