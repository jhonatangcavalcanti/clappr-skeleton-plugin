const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const minimize = !!process.env.MINIMIZE
const analyzeBundle = !!process.env.ANALYZE_BUNDLE

let configurations = {
  mode: 'development',
  externals: {
    clappr: {
      amd: 'clappr',
      commonjs: 'clappr',
      commonjs2: 'clappr',
      root: 'Clappr',
    },
  },
  entry: path.resolve(__dirname, 'src/skeleton.js'),
  resolve: { extensions: ['.js'] },
  plugins: [new webpack.DefinePlugin({ VERSION: JSON.stringify(require('./package.json').version) })],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/env', { modules: 'commonjs' }]],
            plugins: [['add-module-exports', { addDefaultProperty: true }]],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, './src/public')],
              }
            }
          }
        ],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.html/,
        loader: 'html-loader?minimize=false',
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'latest/',
    filename: 'clappr-skeleton-plugin.js',
    library: 'SkeletonPlugin',
    libraryTarget: 'umd',
  },
  devServer: {
    contentBase: 'public/',
    host: '0.0.0.0',
  }
}

if (minimize) {
  configurations.mode = 'production'
  configurations.output.filename = 'clappr-skeleton-plugin.min.js'
}

analyzeBundle && configurations.plugins.push(new BundleAnalyzerPlugin())

module.exports = configurations
