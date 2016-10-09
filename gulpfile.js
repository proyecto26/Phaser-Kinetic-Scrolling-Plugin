var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var paths = {
  javascript: ['./src/*.js']
};

gulp.task('default', ['javascript']);

gulp.task('javascript', function() {
    return gulp.src(paths.javascript)
        .pipe(concat("phaser-kinetic-scrolling-plugin.js"))
        .pipe(gulp.dest("./dist/"))
        .pipe(gulp.dest("./examples/js/"))
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/"));
});

gulp.task('watch', function() {
  gulp.watch(paths.javascript, ['javascript']);
});
