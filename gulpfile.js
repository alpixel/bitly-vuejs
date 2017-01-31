var gulp = require('gulp');
var less = require('gulp-less');
var shell = require('gulp-shell');
var cssnano = require('gulp-cssnano');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var rewriteCSS = require('gulp-rewrite-css');
var autoprefixer = require('gulp-autoprefixer');



var npm_folder = './node_modules';

var vars = {
    lib_js: [
        // Vue.js
        npm_folder+'/vue/dist/vue.js',

        // Axios
        npm_folder+'/axios/dist/axios.js'
    ]
};


/*
    * LESS FILES COMPILATION
*/

// Create a minify min.css file compiled from the `src\less` folder
gulp.task('minify_front', function() {
    return gulp.src('src/less/front.less')
        .pipe(less())
        .pipe(cssnano({
            'postcss-minify-font-values': true
        }))
        .pipe(autoprefixer({
            browsers:"> 1%, last 2 versions, Safari >= 8"
        }))
        .pipe(rename({basename: 'front', suffix: '.min'}))
        .pipe(gulp.dest('dist/css/'));
});

// Create a decompressed .css file compiled from the `src\less` folder
gulp.task('front', function() {
    return gulp.src('src/less/front.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers:"> 1%, last 2 versions, Safari >= 8"
        }))
        .pipe(rename({basename: 'front'}))
        .pipe(gulp.dest('dist/css/'));
});


/*
    * JS FILES COMPILATION
*/
// Create a minify .min.js file compiled from the `node_modules` folder
gulp.task('npm_js', function() {
    return gulp.src(vars.lib_js)
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js/'));
});
// Create a minify .min.js file compiled from the `src\js\*.js` files
gulp.task('app_js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('global.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js/'));
});




/*
    * WATCH TASKS
*/
gulp.task('watch',['minify_front','front','app_js'],  function() {
    gulp.watch('src/**/*.less', ['minify_front', 'front']);
    gulp.watch('src/js/**/*.js', ['app_js']); 
});

gulp.task('default', [
  'front',
  'minify_front',
  'app_js',
  'npm_js'
]);
