const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const rename = require('gulp-rename');

const rollupBabel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

function bundleScripts (watch, opts) {
	opts = opts || {};

	let cache;

	const bundler = browserify({
			entries: [opts.path],
			debug: true,
			plugin: [watch ? watchify : null]
		})
		.on('update', () => bundle())
		.on('log', gutil.log)
		.on('error', gutil.log)
		.transform('rollupify', {
			config: {
				cache: false,
				entry: 'opts.path',
				plugins: [
					commonjs({
						include: 'node_modules/!**',
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
						// plugins: ['lodash'],
						presets: ['es2015-rollup', 'stage-2'],
						babelrc: false,
						exclude: 'node_modules/!**'
					})
				]
			}
		});

	const bundle = () => {
		return bundler
			.bundle()
			.on('error', function(err) {
				gutil.log(err.message);
				this.emit('end');
			})
			.pipe(source(opts.filename || 'bundle.js'))
			.pipe(buffer())
			.pipe(gulp.dest(opts.dest));
	};

	return bundle();
};

module.exports = {
	bundleScripts: bundleScripts
};
