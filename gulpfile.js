/**
 * Created by steve on 15/09/2016.
 */
'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const rollup = require('rollup').rollup;
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

gulp.task('lint', () =>
  gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('script', () => {
  return rollup({
    entry: 'src/index.js',
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true
      }),
      commonjs({
        include: 'node_modules/**'
      }),
      replace({
        DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME
      })
    ],
    format: 'cjs',
    moduleName: 'alexa-binman'
  }).then((bundle) => {
    return bundle.write({
      format: 'cjs',
      dest: 'dist/index.js',
      sourceMap: false
    });
  });
});

gulp.task('build', ['script']);
gulp.task('test', ['lint'], () => {});
gulp.task('default', ['test']);
