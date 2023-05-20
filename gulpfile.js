const { task, watch, src, dest, series } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect-php');
const plumber = require('gulp-plumber');

task('browser-sync', function () {
	connect.server({}, function () {
		browserSync.init({
			proxy: '127.0.0.1:8000'
		});
	});

	watch([
        './*.html',
        './*.php',
        './includes/*.php',
        './js/*.js'
    ]).on('change', browserSync.reload)
	watch('./scss/**/*.scss', series('css'))
})

task('css', () => {
	return src('./scss/main.scss')
		.pipe(plumber([{
			errorHandler: false
		}]))
		.pipe(sass())
		.pipe(prefix())
		.pipe(dest('./css/'))
		.pipe(browserSync.stream())
})

task('dist', () => {
	del.sync('dist');

	src([
			'./**/*',
			'!./node_modules/**/*',
			'!./node_modules',
			'!./scss/**/*',
			'!./scss',
			'!.gitignore',
			'!gulpfile.js',
			'!readme.md',
			'!package.json',
			'!package-lock.json',
			'!.git'
		])
		.pipe(dest('dist'));

	src('./scss/main.scss')
		.pipe(plumber([{
			errorHandler: false
		}]))
		.pipe(sass())
		.pipe(prefix())
		.pipe(cleanCSS())
		.pipe(dest('./dist/css/'))
})

task('default', series('browser-sync', 'css'));

// gulpfile.js - should be updated with new gulp functions.