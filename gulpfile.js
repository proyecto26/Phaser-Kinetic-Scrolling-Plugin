var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var open = require('gulp-open');

var paths = {
  source: ['./src/*.js']
};

gulp.task('default', ['dist', 'examples', 'watch']);

gulp.task('dist', function() {
  return gulp.src(paths.source)
    .pipe(concat("phaser-kinetic-scrolling-plugin.js"))
    .pipe(gulp.dest("./dist/"))
    .pipe(gulp.dest("./examples/js/"))
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/"))
    .pipe(connect.reload());
});

gulp.task('examples', function() {
  var defaultUrl = 'examples/';
  var port = 3000;
  connect.server({
    root: 'examples',
    livereload: true,
    port: port
  });
  gulp.src(defaultUrl)
  .pipe(open({uri: 'http://localhost:' + port + '/index.html' }));
});

gulp.task('watch', function() {
  gulp.watch(paths.source, ['dist']);
});