const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const vinyl  = require('vinyl');
const through2 = require('through2');

const rollupBabel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

function bundleScripts(watch, opts = {}) {

  const bundler = function() {
    const b = browserify({
        entries: opts.path,
        debug: true,
        plugin: [watch ? watchify : null]
      })
        .on('log', gutil.log)
        .on('error', gutil.log)
        .transform('rollupify', {
          config: {
            onwarn: function(message) {
              if (message.code === 'THIS_IS_UNDEFINED') {
                return;
              }
              console.error(message);
            },
            plugins: [
              commonjs({
                include: 'node_modules/**',
                namedExports: {
                  'node_modules/events/events.js': Object.keys(require('events'))
                }
              }),
              nodeResolve({
                jsnext: true,
                main: true,
                preferBuiltins: false
              }),
              rollupBabel({
                plugins: ['lodash'],
                presets: ['es2015-rollup', 'stage-2'],
                babelrc: false,
                exclude: 'node_modules/!**'
              })
            ]
          }
        }),
      stream = through2.obj(function(file, enc, next) {
        // add each file to the bundle
        b.add(file.path);
        next();
      }, function(next) {
        b.bundle(function(err, src) {
          if (err) {
            throw err;
          }

          // create a new vinyl file with bundle contents
          // and push it to the stream
          stream.push(new vinyl({
            path: opts.filename || 'bundle.js', // this path is relative to dest path
            contents: src
          }));
          next();
        });
      });
    return stream;
  };

  return gulp.src(opts.path)
    .pipe(bundler())
    .pipe(gulp.dest(opts.dest));
}

module.exports = {
  bundleScripts: bundleScripts
};
