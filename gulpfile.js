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


gulp.task('css', () => {
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

gulp.task('jekyll', ['scripts:bundle:watch', 'scripts:bundles:watch'], () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

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

  gulp.watch('./_css/**/*.scss', ['css']);
  gulp.watch('./_js/**/*.js', ['js']);
  // gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});


gulp.task('js', () => {
  gulp.src('./_js/**/*.js')
  .on('error', function(err) {
    gutil.log(err.message)
  })
  .pipe(babel())
  .pipe(gulp.dest('js'))
});

gulp.task('scripts:bundle:watch', () => bundleScripts(true, {
  path: './_js/standard-bundle.js',
  dest: './js/compiled/',
  filename: 'standard-bundle.js'
}));

gulp.task('scripts:bundles:watch', (done) => {
  var root = './_prototypes';

  glob(root + '/**/bundle.js', function(err, files) {
    if (err) {
      done(err);
    }

    var tasks = files.map(function (entry) {
      return bundleScripts(true, {
        path: entry,
        dest: entry.replace(root, './js/compiled').replace('bundle.js', '')
      });
    });

		es.merge(tasks).on('end', done);
  });
});


gulp.task('fonts', () => {
  gulp.src('./_fonts/**/*')
  .pipe(gulp.dest('./s/fonts/'));
});

gulp.task('img', () => {
  gulp.src('./_img/**/*')
  .pipe(gulp.dest('./img'));
});

gulp.task('netlify', ['css', 'img', 'fonts', 'jekyll', 'sprite']);

gulp.task('default', ['css', 'img', 'fonts', 'jekyll', 'serve', 'sprite']);
