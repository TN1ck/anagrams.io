const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const extractCss = new ExtractTextPlugin({
  filename: 'style.css',
  allChunks: true,
  disable: !IS_PRODUCTION
});

const basePlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }
  }),
  new HtmlWebpackPlugin({
    template: './index.html',
    inject: 'body'
  }),
  extractCss,
];

const prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    sourceMap: false,
    compress: {
      screw_ie8: true,
      warnings: false
    },
    output: {
      comments: false,
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  })
];

const devPlugins = [
  new webpack.HotModuleReplacementPlugin()
];

const plugins = basePlugins.concat(
  IS_PRODUCTION ? prodPlugins : devPlugins
);

console.log('IS PRODUCTION', IS_PRODUCTION);

module.exports = {
  devtool: 'eval',
  entry: IS_PRODUCTION ? ['./src/index'] : [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css'],
    modules: [
      'node_modules',
      path.resolve('./'),
    ]
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        use: [
          {
            loader: 'worker-loader',
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader"
          },
        ],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        use: IS_PRODUCTION ? ['style-loader', 'css-loader'] : extractCss.extract({
          use: 'css-loader',
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.csv$/,
        use: ['raw-loader'],
        include: path.join(__dirname, '../dictionaries')
      }
    ]
  }
};
