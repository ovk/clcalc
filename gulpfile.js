var gulp            = require('gulp'),
    eslint          = require('gulp-eslint'),
    less            = require('gulp-less'),
    uglify          = require('gulp-uglify'),
    gulpif          = require('gulp-if'),
    connect         = require('gulp-connect'),
    concat          = require('gulp-concat'),
    pug             = require('gulp-pug'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleancss        = require('gulp-clean-css'),
    sourcemaps      = require('gulp-sourcemaps'),
    dev             = false,
    OUTPUT_DIR      = './dist';

// Copy static assets to the output folder.
function taskAssets()
{
    return gulp.src([
        './images/favicon.ico',
        './images/brand.png',
        './images/github.png',
        './images/checkerboard.png'
    ]).pipe(gulp.dest(OUTPUT_DIR));
};

// Generate CSS bundle from the LESS source files.
function taskStyles()
{
    var l = less();
    l.on('error',function (e)
    {
        process.stderr.write(e.toString() + '\n');
        process.exit(1);
    });

    return gulp.src('./styles/main.less')
               .pipe(l)
               .pipe(autoprefixer({ 'cascade': false }))
               .pipe(cleancss())
               .pipe(gulp.dest(OUTPUT_DIR));
};

// Generate HTML files from the PUG source files.
function taskHtml()
{
    return gulp.src([ './pages/*.pug', '!./pages/page.pug', '!./pages/config.pug' ])
               .pipe(pug({ 'pretty': dev }))
               .pipe(gulp.dest(OUTPUT_DIR));
};

// Generate JavaScript bundle from source files.
function taskJs()
{
    return gulp.src([ './js/**/*.js' ])
               .pipe(gulpif(dev, sourcemaps.init()))
               .pipe(concat('calc.js'))
               .pipe(uglify())
               .pipe(gulpif(dev, sourcemaps.write('./')))
               .pipe(gulp.dest(OUTPUT_DIR));
};

// Start development web server.
// gulp.task('webserver', function()
function taskWebserver()
{
    connect.server({ 'root': OUTPUT_DIR, 'livereload': false, 'host': 'localhost', 'port': 8080 });
};

// Watch for changes in source files and re-run corresponding tasks.
function taskWatch()
{
    gulp.watch('./styles/*.less', taskStyles);
    gulp.watch('./js/**/*.js', taskJs);
    gulp.watch('./pages/*.pug', taskHtml);
};

// Enable development build
function taskEnableDev(cb)
{
    dev = true;
    cb();
};

// Run eslint against JavaScript source files.
function taskEslint()
{
    return gulp.src([ './js/**/*.js' ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Export all individial tasks
exports.assets = taskAssets;
exports.styles = taskStyles;
exports.html = taskHtml;
exports.js = taskJs;
exports.webserver = taskWebserver;
exports.watch = taskWatch;
exports.eslint = taskEslint;

// Default: build release version
var taskDefault = gulp.parallel(taskAssets, taskHtml, taskStyles, taskJs);
exports.default = taskDefault;

// Build development version, start web server and watch for changes in source files.
// In development version sourcemaps for JavaScript files are generated and generated HTML is beautified.
exports.dev = gulp.series(taskEnableDev, gulp.series(taskDefault, gulp.parallel(taskWebserver, taskWatch)));
