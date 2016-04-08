'use strict';
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
const express = require('express');
const gulp = require('gulp');
const del = require('del');
const env = require('gulp-env');
const objectAssign = require('object-assign');
const wpConfig = require('./webpack.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

gulp.task('clean', cb => del(['dist'], cb));

gulp.task('build', ['clean'], () => {
  let config = objectAssign({}, wpConfig, {
    plugins: [
      new ExtractTextPlugin('global.css'),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    ]
  });
  return gulp.src('./src/**/*.js')
    .pipe(env.set({
      NODE_ENV: 'production'
    }))
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest('dist'));
});

gulp.task('dev', cb => {
  env({
    NODE_ENV: 'development'
  });
  const app = express();
  let config = objectAssign({}, wpConfig, {
    devtool: 'cheap-module-source-map',
    plugins: [
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin('global.css')
    ]
  });
  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(express.static(__dirname));
  app.listen(8000, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('Page is running at: http://local.forexmaster.cn:8000/pages/index.html');
    }
    cb();
  });
});

gulp.task('default', ['build']);
