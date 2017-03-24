// Include gulp
var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

//Compile LESS files from /less into /less
gulp.task('less', function() {
    return gulp.src('assets/less/*.less')
        .pipe(less())

        .pipe(gulp.dest('less'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('assets/css/style.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('assets/javascript/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('assets/javascript/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('assets/javascript/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('assets/javascript/*.js', ['lint', 'scripts']);
    gulp.watch('assets/css/*.css', ['css']);
});

// Run all this shit
gulp.task('default', ['minify-css', 'scripts', 'watch']); //'lint',

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('assets/less/*.less', ['less']);
    gulp.watch('assets/css/*.css', ['minify-css']);
    gulp.watch('assets/javascript/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('assets/**/*.js', browserSync.reload);
});
