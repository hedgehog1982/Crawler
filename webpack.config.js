var path = require('path');
var webpack = require('webpack');


module.exports = {
    entry: './js/app.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                  compact: [false],
                  presets: ['react', 'es2015'],
                  plugins: [
                  'transform-class-properties'
                ]
                }
            }
        ],
    },
     /*plugins: [
                        new webpack.DefinePlugin({
                           'process.env': {
                                'NODE_ENV': JSON.stringify('production')
                             }
                         }),
                         new webpack.optimize.UglifyJsPlugin()

                    ],   */
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
