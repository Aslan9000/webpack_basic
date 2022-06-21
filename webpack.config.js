const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
]

class RunAfterCompile{
    apply(complier){
        complier.hooks.done.tap('Copy images', function(){
            fse.copySync('./app/assets/images', './dist/assets/images')
            fse.copySync('./app/assets/icons', './dist/assets/icons')
        })
    }
}

let pages = fse.readdirSync('./app').filter(function(file){
    return file.endsWith('.html')
}).map(function(page){
    return new HtmlWebpackPlugin({
        filename: page,
        template: `./app/${page}`
    })
})

let cssConfig = {
    test: /\.css$/i,
    use: [{loader: "css-loader", options: {url: true}}, {loader: "postcss-loader", options: {postcssOptions: {plugins: postCSSPlugins}}}]
}

let config = {
    entry: './app/assets/scripts/App.js',
    plugins: pages,
    module: {
        rules: [
            cssConfig,
            {
                test: /\.(.png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.html$/i,
                loader: "html-loader"
            }
        ]
    } 
}

if(currentTask == 'dev'){
    cssConfig.use.unshift('style-loader')
    config.output = {
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'app')
    }
    
    config.devServer = {
      static: {directory: path.join(__dirname, 'app')},
      hot: true,
      port: 3000,
      host: '0.0.0.0'
    }

    config.mode =  'development'
}

if(currentTask == 'build'){
    config.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    })
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    config.output = {
        filename: '[name].[chuckhash].js',
        chunkFilename: '[name].[chuckhash].js',
        path: path.resolve(__dirname, 'dist')
    }

    config.mode = 'production'
    
    config.optimization = {
        splitChunks: {chunks: 'all'},
        minimize: true, 
        minimizer: [`...`, new CssMinimizerPlugin()]
    }

    config.plugins.push(
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
        new RunAfterCompile()
    )
}


module.exports = config