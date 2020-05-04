const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');
const open = require('gulp-open');
const cleanDest = require('gulp-clean-dest');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['build', 'examples', 'watch']);

gulp.task('build', ['compile', 'minify']);

gulp.task('compile', function () {
  return tsProject.src().pipe(tsProject())
    .pipe(cleanDest('dist'))
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('./examples/dist/'))
});

gulp.task('minify', ['compile'], function () {
  return gulp.src(['dist/*.js', '!dist/*.min.js'])
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
  gulp.watch(['./src/*.ts'], ['build']);
});
