var bower = require('bower'),
    del = require('del'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    gulp = require('gulp'),
    header = require('gulp-header'),
    minifyCss = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    gulpCopy = require('gulp-copy'),
    sh = require('shelljs'),
    insert = require('gulp-insert'),
    serve = require('gulp-serve'),
    pkg = require('./package.json');

var banner = ['/**',
  ' * <%= pkg.name %> v<%= pkg.version %>',
  ' * <%= now %>',
  ' * @description <%= pkg.description %>',
  ' */',
  '',
  ''].join('\n');

var paths = {
  sass: ['./scss/**/*.scss'],
  src: [
      './www/js/app.js',
  ],
  vendor: {
    min: [
      './bower_components/angularfire/dist/angularfire.min.js',
      './bower_components/firebase/firebase.js',
      './bower_components/ionic/release/js/ionic.bundle.min.js',
    ],
    src: [
      './bower_components/angularfire/dist/angularfire.js',
      './bower_components/firebase/firebase-debug.js',
      './bower_components/ionic/release/js/ionic.bundle.js',
    ]
  },
  css: [
    './release/ionic.app.min.css',
    './www/css/styles.css'
  ],
  fonts: [
    './bower_components/ionic/fonts/ionicons.eot',
    './bower_components/ionic/fonts/ionicons.svg',
    './bower_components/ionic/fonts/ionicons.ttf',
    './bower_components/ionic/fonts/ionicons.woff'
  ],
  releaseDir: './release/',
  distDir: './www/dist/'
};

var concatNewLine = {newLine: '\n\n'};

function date(){
  var d = new Date();
  return d.toString();
}

gulp.task('build:vendor', function() {
  gulp.src(paths.vendor.src)
    .pipe(concat('vendor.js', concatNewLine))
    .pipe(header(banner, {pkg : pkg, now: date()}))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('build:app', function(){
  gulp.src(paths.src)
    .pipe(concat('app.js', concatNewLine))
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest(paths.distDir));
});

gulp.task('build', ['build:vendor', 'build:app']);

gulp.task('release:vendor', function() {
  gulp.src(paths.vendor.min)
    .pipe(concat('vendor.min.js', concatNewLine))
    .pipe(header(banner, {pkg : pkg, now: date()}))
    .pipe(gulp.dest(paths.distDir));
});

gulp.task('release:app', ['build:app'], function() {
  gulp.src(paths.distDir+'app.js')
    .pipe(insert.append(';'))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(uglify())
    .pipe(header(banner, {pkg : pkg, now: date()}))
    .pipe(gulp.dest(paths.distDir));
});

gulp.task('release', ['release:vendor', 'release:app']);

gulp.task('sass', function(done) {
  gulp.src(paths.fonts, {base:'./bower_components/ionic'})
        .pipe(gulp.dest('./www/css/'));
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./release/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./release/'))
    .on('end', done);
  gulp.src('./release/ionic.app.min.css')
    .pipe(gulp.dest('./www/css/'));
});

gulp.task('serve', serve('www'));

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch('./www/js/**/*.js', ['build:app']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('default', ['watch', 'serve']);

