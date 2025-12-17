const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports =  merge(common, {
    mode: "development",

	devServer: {
		port: 8000,
		open: true,
		hot: true,
        liveReload: true
	},

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
});