const SpritesmithPlugin = require('webpack-spritesmith');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const SvgStore = require('webpack-svgstore-plugin');

const path = require('path');
const glob = require('glob');

const viewPath = 'src/markup/';
const files = glob.sync('src/markup/*.html');
const htmlWebpackPlugins = files.map(
  (file) =>
    new HtmlWebPackPlugin({
      filename: file.replace(viewPath, ''),
      template: `${file}`,
      inject: 'body',
    })
);

module.exports = {
  mode: 'development',
  entry: {
    index: './src/markup/index.js',
  },
  output: {
    path: path.resolve(__dirname, '../src/markup/'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(png|jpeg|gif|svg|ttf|eof|woff(2)?)(\?.*)?$/,
        loader: 'file-loader',
      },
    ],
  },
  devServer: {
    contentBase: viewPath,
    hot: true,
    progress: true,
    host: '127.0.0.1',
    historyApiFallback: {
      index: 'index.html',
    },
    open: true,
    watchContentBase: true,
  },
  plugins: [
    ...htmlWebpackPlugins,
    new SpritesmithPlugin({
      src: {
        cwd: 'src/markup/sprite/sprite_pngs/',
        glob: '*',
      },
      target: {
        image: 'src/markup/img/sprite.png',
        css: 'src/markup/sprite/spritesmith_generated/spritesmith_sprite.scss',
      },
      apiOptions: {
        cssImageRef: 'sprite.png',
      },
      spritesmithOptions: {
        padding: 10,
      },
    }),
    new SvgStore({
      svgoOptions: {
        plugins: [{ removeTitle: true }],
      },
      prefix: 'icon',
    }),
  ],
};
