var path = require('path');
var cssnext = require('postcss-cssnext');
var postcssImport = require('postcss-import');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src/');

var config = {
    entry: ['babel-polyfill', path.join(APP_DIR, '/app.jsx')],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: BUILD_DIR,
        filename: 'app.js'
    },
    devtool: "#inline-source-map",
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: /node_modules/,
            include: APP_DIR,
            query: {
                cacheDirectory: true,
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader?sourceMap!postcss-loader"
        }, {
            test: /\.(png|jpg|svg|gif)$/,
            loader: 'file-loader?name=[name].[ext]'
        }]
    },
    postcss: function() {
        return [
            postcssImport({
                onImport: function(files) {
                    files.forEach(this.addDependency);
                }.bind(this)
            }),
            cssnext()
        ];
    }
};

// "start" is just the name of the script in our package.json for the
// development server. Customize it here as necessary.
if (process.env.npm_lifecycle_event === 'dev') {
    let port = 1337;
    // We don't need or want to run hot-module-replacement code in
    // ordinary build processes, so we'll push it into the presets stack here.
    config.module.loaders[0].query.presets.push('react-hmre');

    // Configure our development server
    config.devServer = {
        contentBase: BUILD_DIR,
        hot: true,
        progress: true,
        stats: 'errors-only',
        host: process.env.HOST,
        // port: process.env.PORT
        port: port
    };
}

module.exports = config;
