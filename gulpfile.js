// Include gulp
var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');//
var cleanCSS = require('gulp-clean-css');//
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');//
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('less/creative.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('css/creative.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/creative.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Renamed files need updating -bn 3/20
// Copy vendor libraries from /node_modules into /vendor
// gulp.task('copy', function() {
//     gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
//         .pipe(gulp.dest('vendor/bootstrap'))

//     gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
//         .pipe(gulp.dest('vendor/jquery'))

//     gulp.src(['node_modules/magnific-popup/dist/*'])
//         .pipe(gulp.dest('vendor/magnific-popup'))

//     gulp.src(['node_modules/scrollreveal/dist/*.js'])
//         .pipe(gulp.dest('vendor/scrollreveal'))

//     gulp.src([
//             'node_modules/font-awesome/**',
//             '!node_modules/font-awesome/**/*.map',
//             '!node_modules/font-awesome/.npmignore',
//             '!node_modules/font-awesome/*.txt',
//             '!node_modules/font-awesome/*.md',
//             '!node_modules/font-awesome/*.json'
//         ])
//         .pipe(gulp.dest('vendor/font-awesome'))
// })

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});

// Run all this shit
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});
