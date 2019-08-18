const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

gulp.task('sass', () => {
	return gulp.src('scss/!style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(gulp.dest('public/css/'))
});

gulp.task('sass:watch', () => {
	gulp.watch('scss/**/*.scss', gulp.series('sass'))
		.on('error', gulp.series('sass:watch'));
});
