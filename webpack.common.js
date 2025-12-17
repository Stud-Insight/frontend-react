const path = require("path");

module.exports = {
    entry: "./frontend/index.tsx",
    
    output: {
        path: path.join(__dirname, "public"),
        filename: "index.js",
        clean: true
    },
    
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
                test: /\.(png|svg)$/,
                type: "asset/resource",
                generator: {
                    filename: "images/[name][hash][ext]"
                }
            }
        ]
    }
}