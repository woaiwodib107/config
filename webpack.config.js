var path = require('path');
var rootPath = __dirname
var appdir = path.join(__dirname, 'app');
var webpack = require('webpack');
module.exports = {
    entry: {
        js: path.join(appdir, 'index.js'),
        html: path.join(appdir, 'index.html')
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        loaders: [
            { test: /\.(js|jsx)$/, loader: 'babel-loader' },
            { test: /\.html$/,loader: 'file?name=[name].[ext]' },//'file?name=[name].[ext]', 'html-withimg-loader
            { test: /\.css$/,loaders: ['style-loader', 'css-loader?importLoaders=1'] },
            { test: /\.json/, loader: 'json-loader' },
            { test: /\.(png|jpg|svg)$/, loader: 'url?limit=80000' },//&name=images/[hash:8].[name].[ext]
            { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000' }
        ]
    },resolve: {
        extensions: ['', '.js'],
        alias: {
            staticVar: path.join(__dirname, "app/staticVar.js"),
            map: path.join(__dirname, "app/map.js"),
            indexcss: path.join(__dirname, "app/index.css"),
            VTKLoader: path.join(__dirname, "app/VTKLoader.js"),
            triangulationRender: path.join(__dirname, "app/triangulationRender.js")
        }
    },
    devtool: 'evil-source-map',
    devServer: {
         contentBase: path.resolve(__dirname, 'dist'),
        // inline: true,
        // progress: true,
        // stats: { color: true },
        port: 8080
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}
