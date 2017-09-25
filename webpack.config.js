// module.exports = {
//     entry: [
//         './public/src/redux-store/index.js'
//     ],
//     output: {
//         filename: './public/src/redux-store.js'
//     },
//     watch: true,
//     devtool:"inline-source-map"
// };
var webpack = require('webpack');
module.exports = function (env) {
    var PROD = false
    if (env == "prod") {
        PROD = true
    }

    return {
        entry: [
            './public/src/redux-store/index.js'
        ],
        output: {
            filename: './public/src/redux-store.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    loaders: [
                        'babel-loader'
                    ]
                }
            ]
        },
        plugins: PROD ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false }
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            })

        ] : [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('development')
                })
            ],
        watch: !PROD,
        devtool: "inline-source-map"
    }
};