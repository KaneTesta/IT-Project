var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('scss/!style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('scss/**/*.scss', gulp.series('sass'))
        .on('error', gulp.series('sass:watch'));
});