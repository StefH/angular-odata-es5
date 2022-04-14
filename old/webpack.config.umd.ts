import * as path from 'path';
import * as webpack from 'webpack';

const angularExternals = require('webpack-angular-externals');
const rxjsExternals = require('webpack-rxjs-externals');
const pkg = require('./package.json');

export default {
  entry: {
    'angular-odata-es5.umd': path.join(__dirname, 'src', 'index.ts'),
    'angular-odata-es5.umd.min': path.join(__dirname, 'src', 'index.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist', 'bundles'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'AngularODataES5'
  },
  externals: [
    angularExternals(),
    rxjsExternals()
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader?emitErrors=true&failOnHint=true',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      sourceMap: true
    }),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.join(__dirname, 'src')
    ),
    // https://github.com/angular/angular/issues/11580
    new webpack.ContextReplacementPlugin(
      /\@angular(\\|\/)core(\\|\/)fesm5/,
      path.join(__dirname, 'src')
    ),
    new webpack.BannerPlugin({
      banner: `
/**
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @link ${pkg.homepage}
 * @license ${pkg.license}
 */
      `.trim(),
      raw: true,
      entryOnly: true
    })
  ]
};
