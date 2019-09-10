const SpritesmithPlugin = require('webpack-spritesmith');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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

const JS_FILENAME = 'bundle.js';
const PROJECT_ROOT = path.resolve(__dirname, '../');
const APP_ENTRY = path.join(PROJECT_ROOT, 'src/markup');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'dist');

const commonConfig = {
  entry: `${APP_ENTRY}/index.js`,
  output: {
    filename: JS_FILENAME,
    path: OUTPUT_PATH,
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
    contentBase: APP_ENTRY,
    hot: true,
    progress: true,
    host: '127.0.0.1',
    historyApiFallback: {
      rewrites: [{ from: /.*/g, to: '/index.html' }],
    },
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
    new MiniCssExtractPlugin(),
  ],
};

module.exports = commonConfig;
