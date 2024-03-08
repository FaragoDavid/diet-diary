const path = require('path');

module.exports = {
  entry: './src/serverless.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'api'),
  },
};