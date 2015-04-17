
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var babel = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var path = require('path');
var reload = browserSync.reload;
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
var watchify = require('watchify');

var paths = {
  assets: 'src/assets/**/*',
  css:    'src/css/*.css',
  html:   'src/*.html',
  libs:   [
    'bower_components/phaser-official/build/phaser.js',
    'bower_components/phaser-official/build/phaser.min.js',
    'bower_components/phaser-official/build/phaser.map'
  ],
  js:     ['src/js/**/*.js'],
  dist:   './dist/'
};


gulp.task('clean', function (callback) {
  rimraf(paths.dist, callback);
});

function compile(watch) {
  var bundler = watchify(
    browserify('./src/js/main.js', {
      debug: true,
      paths: ['./src/js/'],
      external: './src/js/**/*.js',
      transform: ['browserify-shim']
    }).transform(babel)
  );

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))

      // uglifyjs strips out debugger statements (option for this added in
      // uglifyjs2).
      // For now, comment out uglify, but should probably use process.env to
      // switch on/off.
      //.pipe(uglify())

      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/js'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle().pipe(reload({stream: true}));
    });
  }

  return rebundle();
}

function watch() {
  return compile(true);
}

gulp.task('js', compile);

gulp.task('copy-assets', function () {
  gulp.src(paths.assets)
    .pipe(gulp.dest(paths.dist + 'assets'))
    .on('error', gutil.log);
});

gulp.task('copy-vendor', function () {
  gulp.src(paths.libs)
    .pipe(gulp.dest('./dist/js/vendor'))
    .on('error', gutil.log);
});

gulp.task('styles', function () {
  return gulp.src('src/styles/main.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      // The less-clean-css plugin currently breaks during sourcemap
      // generation, but we should switch to that from gulp-minify-css once it
      // is fixed.
      plugins: [],
      paths: []
    }))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(reload({stream: true}));
});


gulp.task('dev_lint', function() {
  return gulp.src(paths.js)
    .pipe(eslint({
      envs: ['es6']
    }))
    .pipe(eslint.format())
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(eslint({
      envs: ['es6']
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(minifyhtml())
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream: true}));
});

gulp.task('build', function (callback) {
  runSequence('clean', ['lint', 'copy-assets', 'copy-vendor', 'html', 'js', 'styles'], callback);
});

gulp.task('build', function (callback) {
  runSequence('clean', ['dev_lint', 'copy-assets', 'copy-vendor', 'html', 'js', 'styles'], callback);
});

gulp.task('browser-sync', function() {
  browserSync({
    server: './dist'
  });
  gulp.watch('src/styles/**/*.less', ['styles']);
  gulp.watch('src/*.html', ['html']);
  return watch();
});

gulp.task('serve', function (callback) {
  runSequence('build', 'browser-sync', callback);
});

gulp.task('default', ['serve']);
