var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	recess = require('gulp-recess'),
	minifyCSS = require('gulp-minify-css'),
	jade = require('gulp-jade'),
	server = require('gulp-express');

gulp.task('jade', function() {
	return gulp.src('dev/jade/**/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('public'));
});

gulp.task('lint', function() {
	return gulp.src('dev/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('js', function() {
	return gulp.src('dev/js/**/*.js')
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

gulp.task('less', function() {
	return gulp.src('dev/less/**/*.less')
		.pipe(recess())
		.pipe(less())
		.pipe(minifyCSS())
		.pipe(gulp.dest('public/css/'));
});

gulp.task('watch', function() {
	server.run(['app.js']);
	gulp.watch('dev/jade/**/*.jade', ['jade']);
	gulp.watch('dev/js/**/*.js', ['js']);
	gulp.watch('dev/less/**/*.less', ['less']);
	gulp.watch(['public/**/*'], server.notify);
});

gulp.task('default', ['jade', 'js', 'less', 'watch']);
gulp.task('production', ['jade', 'js', 'less']);