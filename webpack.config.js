const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        server: './server.ts',
        // This is an example of Static prerendering (generative)
        prerender: './prerender.ts'
    },
    resolve: { extensions: ['.ts', '.js', '.json'] },
    context: __dirname,
    target: 'node',
    node: {
        __dirname: true,
        __filename: true
    },
    // this makes sure we include node_modules and other 3rd party libraries
    externals: [/(node_modules|main\..*\.js)/, 'pg-native', 'pg-hstore', 'aws-sdk', 'sqlite3'],
    output: {
        path: path.join(__dirname),
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
        // for 'WARNING Critical dependency: the request of a dependency is an expression'
        new webpack.ContextReplacementPlugin(
            /(.+)?angular(\\|\/)core(.+)?/,
            path.join(__dirname, 'src'), // location of your src
            {} // a map of your routes
        ),
        new webpack.ContextReplacementPlugin(
            /(.+)?express(\\|\/)(.+)?/,
            path.join(__dirname, 'src'),
            {}
        ),
        new webpack.ContextReplacementPlugin(
            /(.+)?sequelize(\\|\/)(.+)?/,
            path.join(__dirname, 'src'),
            {}
        )
    ]
};