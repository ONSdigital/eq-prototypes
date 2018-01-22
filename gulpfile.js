const child = require('child_process');
const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const flatten = require('gulp-flatten');
const autoprefixer = require('autoprefixer');
const pixrem = require('pixrem');
const scss = require('postcss-scss');
const pseudoelements = require('postcss-pseudoelements');
const reporter = require('postcss-reporter');
const inlineblock = require('postcss-inline-block');
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');

const rename = require('gulp-rename');
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const ukisData = require('./_data/ukis.json');

const babel = require('gulp-babel');
const plumber = require('gulp-plumber');

const glob = require('glob');
const es = require('event-stream');

const bundleScripts = require('./gulp/javascript').bundleScripts;

const jekyllFlags = [];

// SVG Sprite
gulp.task('sprite', () => {
  gulp.src('./_img/**/*.svg')
    .pipe(svgSprite({
      shape: {
        dimension: {
          maxWidth: 32,
          maxHeight: 32
        },
        spacing: {
          padding: 10
        },
        dest: './s/img/icons/'
      },
      mode: {
        inline: true,
        view: {
          bust: false,
          dest: '.',
          sprite: './img/sprite.svg',
          render: {
            scss: {
              dest: './_css/base/_sprite.scss'
            }
          }
        }
      }
    }))
    .on('error', function(err) {
      gutil.log(err.message.toString())
      browserSync.notify('Browserify Error!')
      this.emit('end')
    })
    .pipe(gulp.dest('.'))
});



/**
 * CSS pattern library additions
 */
gulp.task('css:build', () => {
  gulp.src('./_css/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded',
      sourceComments: false,
      includePaths: [
        './node_modules/eq-sass/',
        './node_modules/gfm.css/source/'
      ],
      onSuccess: function(msg) {
        gutil.log('Done', gutil.colors.cyan(msg))
      }
    }))
    .pipe(flatten())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 versions', 'Explorer >= 8', 'Android >= 4.1', 'Safari >= 7', 'iOS >= 7']
      }),
      pixrem({
        replace: false
      }),
      inlineblock(),
      pseudoelements(),
      reporter({ clearMessages: true })
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'));
});

gulp.task('css:watch', () => {
	return gulp.watch('./_css/**/*.scss', ['css:build']);
});



/**
 * Javascript (currently won't work)
 */
gulp.task('scripts:build', () => {
	gulp.src('./_js/**/*.js')
		.on('error', function(err) {
			gutil.log(err.message)
		})
		.pipe(babel())
		.pipe(gulp.dest('js'))
});

gulp.task('scripts:watch', () => {
	return gulp.watch('./_js/**/*.js', ['scripts:build']);
});

/**
 * Javascript standard patten library modules.
 */
const scriptsBundleDefaultOpts = {
	path: './_js/standard-bundle.js',
	dest: './js/compiled/',
	filename: 'standard-bundle.js'
};

gulp.task('scripts:bundle:build', () => bundleScripts(false, scriptsBundleDefaultOpts));

gulp.task('scripts:bundle:watch', () => bundleScripts(true, scriptsBundleDefaultOpts));

/**
 * Javascript custom code built with pattern library modules.
 */
function scriptsBundles (opts, done) {
	opts = opts || {};

	var root = './_prototypes';

	glob(root + '/**/bundle.js', function(err, files) {
		if (err) {
			done(err);
		}

		var tasks = files.map(function (entry) {
			return bundleScripts(!!opts.watch, {
				path: entry,
				dest: entry.replace(root, './js/compiled').replace('bundle.js', '')
			});
		});

		es.merge(tasks).on('end', done);
	});
}

gulp.task('scripts:bundles:build', scriptsBundles.bind(null, { watch: false }));

gulp.task('scripts:bundles:watch', scriptsBundles.bind(null, { watch: true }));



/**
 * Jekyll configuration
 */
function jekyll (opts) {
	opts = opts || {};

	const jekyllWatchArgs = [
		'--watch',
		'--incremental',
		'--drafts'
	];

	const jekyllArgs = [
		'build',
		...(!!opts.watch ? jekyllWatchArgs : []),
		...jekyllFlags
	];

	const jekyll = child.spawn('jekyll', jekyllArgs);

	const jekyllLogger = (buffer) => {
		buffer.toString()
			.split(/\n/)
			.forEach((message) => gutil.log('Jekyll: ' + message));
	};

	jekyll.stdout.on('data', jekyllLogger);
	jekyll.stderr.on('data', jekyllLogger);
}

gulp.task('jekyll:build', jekyll.bind(null, ({ watch: false })));

gulp.task('jekyll:watch', jekyll.bind(null, ({ watch: true })));


/**
 * Local development server
 */
gulp.task('serve', () => {
  browserSync.init({
    files: ['_site/css/**/*'],
    port: 4000,
    browser: 'false',
    server: {
      baseDir: '_site',
      routes: {
          "/eq-prototypes": "_site"
      }
    },
    startPath: "/eq-prototypes"
  });

  // gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});



gulp.task('fonts', () => {
  gulp.src('./_fonts/**/*')
  	.pipe(gulp.dest('./s/fonts/'));
});

gulp.task('img', () => {
  gulp.src('./_img/**/*')
  	.pipe(gulp.dest('./img'));
});



/**
 * Build ordering
 * Note: Change to gulp.series / gulp.parrellel after gulp upgrade.
 */
gulp.task('build:parrellel-batch', ['scripts:bundle:build', 'scripts:bundles:build', 'css:build', 'img', 'fonts', 'sprite']);

gulp.task('build:jekyll', ['build:parrellel-batch'], () => { gulp.run('jekyll:build'); });

/**
 * Dev ordering
 */
gulp.task('dev:parrellel-batch', ['scripts:bundle:watch', 'scripts:bundles:watch', 'css:watch', 'img', 'fonts', 'sprite']);

gulp.task('dev:jekyll', ['dev:parrellel-batch'], () => { gulp.run('jekyll:watch'); });

gulp.task('dev:serve', ['dev:jekyll'], () => { gulp.run('serve'); });



gulp.task('build', ['build:jekyll']);

gulp.task('dev', ['dev:serve']);

gulp.task('netlify', () => {
	jekyllFlags.push("--baseurl=");
	// jekyllFlags.push("--url=");
	gulp.run('build');
});
gulp.task('default', ['build']);
