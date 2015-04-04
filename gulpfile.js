var gulp = require('gulp')
  , gutil = require('gulp-util')
  , del = require('del')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , minifycss = require('gulp-minify-css')
  , minifyhtml = require('gulp-minify-html')
  , processhtml = require('gulp-processhtml')
  , eslint = require('gulp-eslint')
  , babel = require('gulp-babel')
  , uglify = require('gulp-uglify')
  , connect = require('gulp-connect')
  , paths;

paths = {
  assets: 'src/assets/**/*',
  css:    'src/css/*.css',
  html:   'src/*.html',
  libs:   [
    'src/bower_components/phaser-official/build/phaser.min.js',
    'src/bower_components/phaser-official/build/phaser.map'
  ],
  js:     ['src/js/**/*.js'],
  dist:   './dist/'
};

gulp.task('clean', function (cb) {
  del([paths.dist], cb);
});

gulp.task('copy-assets', ['clean'], function () {
  gulp.src(paths.assets)
    .pipe(gulp.dest(paths.dist + 'assets'))
    .on('error', gutil.log);
});

gulp.task('copy-vendor', ['clean'], function () {
  gulp.src(paths.libs)
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('uglify', ['clean'], function () {
  gulp.src(paths.js)
    .pipe(babel())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify({outSourceMaps: false}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minifycss', ['clean'], function () {
 gulp.src(paths.css)
    .pipe(minifycss({
      keepSpecialComments: false,
      removeEmpty: true
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(eslint({
      envs: [
          'es6'
      ]
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('processhtml', ['clean'], function() {
  gulp.src(paths.html)
    .pipe(processhtml({}))
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('minifyhtml', ['clean'], function() {
  gulp.src('dist/*.html')
    .pipe(minifyhtml())
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('reload', function(){
  connect.reload();
});

gulp.task('connect', function () {
  connect.server({
    root: paths.dist,
    port: 9000,
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['uglify']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.css, ['minifycss']);
  gulp.watch(paths.libs, ['copy-vendor']);
  gulp.watch(paths.assets, ['copy-assets']);
  gulp.watch([paths.js, paths.html, paths.css, 
               paths.libs, paths.assets], ['reload']);
});

gulp.task('default', ['build', 'connect', 'watch']);
gulp.task('build', ['clean', 'copy-assets', 'copy-vendor', 'uglify', 'minifycss', 'processhtml', 'minifyhtml']);
