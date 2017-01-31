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
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');



var npm_folder = './node_modules';

var vars = {
    lib_js: [
        // God exists
        npm_folder+'/jquery/dist/jquery.js',

        // WOW.js
        npm_folder+'/wowjs/dist/wow.js',

        // FastClick
        npm_folder+'/fastclick/lib/fastclick.js',

        // ChuckCSS
        npm_folder+'/ChuckCSS/dist/chuckcss.js',

        // CSSUA
        npm_folder+'/cssuseragent/cssua.js',

        // Backstretch
        npm_folder+'/jquery.backstretch/jquery.backstretch.js',

        // Vue.js
        npm_folder+'/vue/dist/vue.js'
    ],
    lib_fonts: [
        // FontAwesome
        npm_folder+'/font-awesome/fonts/**/*',

        // Ionicons
        npm_folder+'/ionicons/fonts/**/*'
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
// Create a minify .min.js file compiled from the `src\js\global.js` file
gulp.task('app_js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('global.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js/'));
});


/*
    * IMAGEMIN
*/
// Images optimization from the `images` folder
gulp.task('imagemin', function(){
  return gulp.src('images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('images'))
});




/*
    * FONTS
*/
// Import icons fonts from the `node_modules` folder
gulp.task('fonts', function() {
  return gulp.src(vars.lib_fonts)
  .pipe(gulp.dest('dist/fonts'))
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
  'npm_js',
  //'imagemin',
  'fonts'
]);
