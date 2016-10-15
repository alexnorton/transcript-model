module.exports = {
  entry: './src/TranscriptModel.js',
  output: {
    path: './lib',
    filename: 'bundle.js',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: ['es2015'],
          plugins: ['add-module-exports'],
        },
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
      },
    ],
  },
  externals: {
    immutable: 'immutable',
    ajv: 'ajv',
  },
};
