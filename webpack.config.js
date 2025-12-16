const path = require("path");
const html_plugin = require("html-webpack-plugin");
const css_plugin = require("mini-css-extract-plugin")

module.exports = {
    mode: "development",
    entry: "./frontend/index.tsx",
    output: {
        path: path.join(__dirname, "public"),
        filename: "index.js",
        clean: true
    },
	devServer: {
		port: 8000,
		open: true,
		hot: true,
	},
    plugins: [
        new html_plugin({
            template: "./frontend/index.html",
            filename: "index.html"
        }),

        new css_plugin({
            filename: "index.css"
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
            }
        ]
    }
}