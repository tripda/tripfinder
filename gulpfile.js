var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var source_files = [
    "./helpers/angular-module.js",
    "./helpers/angular-http-client.js",
    "./src/*.js",
];

gulp.task('build', ['concat']);

gulp.task('concat', function() {
    return gulp.src(source_files)
        .pipe(concat('tripfinder.js'))
        .pipe(gulp.dest('./dist/'))
});
