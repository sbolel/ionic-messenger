var bower = require('bower'),
    concat = require('gulp-concat'),
    fs = require('fs'),
    gutil = require('gulp-util'),
    gulp = require('gulp'),
    ngAnnotate = require('gulp-ng-annotate'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    serve = require('gulp-serve'),
    sh = require('shelljs'),
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
      './www/js/**/*.js'
  ],
  vendor: {
    min: [
      './bower_components/ionic/release/js/ionic.bundle.min.js'
    ],
    src: [
      './bower_components/ionic/release/js/ionic.bundle.js'
    ]
  },
  css: [
    './bower_components/ionic/release/css/ionic.css',
    './bower_components/ionic/release/css/ionic.min.css'
  ],
  fonts: [
    './bower_components/ionic/release/fonts/ionicons.eot',
    './bower_components/ionic/release/fonts/ionicons.svg',
    './bower_components/ionic/release/fonts/ionicons.ttf',
    './bower_components/ionic/release/fonts/ionicons.woff'
  ],
  lib: './www/lib/',
  dist: './www/dist/'
};

gulp.task('lib', function(){
  gulp.src(paths.vendor.src)
    .pipe(gulp.dest(paths.lib));
  gulp.src(paths.vendor.min)
    .pipe(gulp.dest(paths.lib));
  gulp.src(paths.css)
    .pipe(gulp.dest(paths.lib));
});

gulp.task('fonts', function(){
  gulp.src(paths.fonts)
    .pipe(gulp.dest('./www/assets/fonts'));
  gulp.src(['./www/lib/ionic.css', './www/lib/ionic.min.css'])
    .pipe(replace(/\.\.\/fonts/g, '../assets/fonts'))
    .pipe(gulp.dest('./www/lib/'));
});

gulp.task('makeLibs', ['lib', 'fonts']);

gulp.task('build', function(){
  gulp.src(paths.src)
    .pipe(concat('app.js', {newLine: '\n\n'}))
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest(paths.distDir));
});

gulp.task('bowerInstall', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('install', ['bowerInstall', 'makeLibs']);

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

gulp.task('serve', serve('www'));

gulp.task('watch', function() {
  gulp.watch('./www/js/**/*.js', ['build:app']);
});

gulp.task('default', ['makeLibs', 'serve']);
// gulp.task('default', ['makeLibs', 'build', 'watch', 'serve']);
