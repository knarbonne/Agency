'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const rtlcss = require('gulp-rtlcss');
const gulpif = require('gulp-if');

const enableRTL = false; // Set to true to generate RTL styles

const Paths = {
    TEMPLATE: './',
    SCSS: 'template/assets/scss/**/*.scss',
    CSS: 'template/assets/css/',
    JS: 'template/**/*.js',
    HTML: '*.html'
};

// Compile SCSS into CSS with Autoprefixer and optional RTL
gulp.task('sass', function () {
    return gulp.src(Paths.SCSS)
        .pipe(sourcemaps.init())
        .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest(Paths.CSS))
        .pipe(gulpif(enableRTL, rtlcss()))
        .pipe(gulpif(enableRTL, rename({ suffix: '-rtl' })))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(Paths.CSS))
        .pipe(browserSync.stream());
});

// Launch local server
gulp.task('serve', function (done) {
    browserSync.init({
        server: Paths.TEMPLATE
    });
    done();
});

// Watch files and reload browser on changes
gulp.task('watch', function (done) {
    gulp.watch(Paths.SCSS, gulp.series('sass'));
    gulp.watch(Paths.SCSS).on('change', browserSync.reload);
    gulp.watch(Paths.HTML).on('change', browserSync.reload);
    gulp.watch(Paths.JS).on('change', browserSync.reload);
    done();
});

// Default task
gulp.task('default', gulp.series('sass', 'serve', 'watch'));
