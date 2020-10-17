var fs              = require('fs'),
    gulp            = require('gulp'),
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
    replace         = require('gulp-replace'),
    dev             = false,
    OUTPUT_DIR      = './dist';

var staticAssets = [
    './images/favicon.ico',
    './images/github.png',
    './images/checkerboard.png',
    './images/clcalc-16.png',
    './images/clcalc-32.png',
    './images/clcalc-150.png',
    './images/clcalc-192.png',
    './images/clcalc-512.png',
    './browserconfig.xml',
    './manifest.webmanifest'
];

// Copy static assets to the output folder.
function taskAssets()
{
    return gulp.src(staticAssets).pipe(gulp.dest(OUTPUT_DIR));
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
function taskJsSrc()
{
    return gulp.src([ './js/**/*.js', '!./js/sw.js' ])
               .pipe(gulpif(dev, sourcemaps.init()))
               .pipe(concat('calc.js'))
               .pipe(uglify())
               .pipe(gulpif(dev, sourcemaps.write('./')))
               .pipe(gulp.dest(OUTPUT_DIR));
};

// Generate Service Worker script file
function taskJsServiceWorker()
{
    var version = JSON.parse(fs.readFileSync('./package.json')).version;
    var configPug = fs.readFileSync('./pages/config.pug').toString();
    var depsJson = JSON.parse(configPug.replace(/^-$/m, "").replace("var lib =", "").replace(/'/g, '"'));
    var depsList = [];

    for (var idx in depsJson)
    {
        var dep = depsJson[idx];
        for (var key of [ 'js', 'css', 'font' ])
        {
            if (dep[key])
                depsList = depsList.concat(dep[key].url);
        }
    }

    var cachedFiles = [ '/', './main.css', './calc.js' ]
        .concat(depsList)
        .concat(staticAssets.map(f => f.replace("images/", "")));

    return gulp.src([ './js/sw.js' ])
               .pipe(replace('VERSION', version))
               .pipe(replace('CACHED_FILES', JSON.stringify(cachedFiles)))
               .pipe(gulpif(dev, sourcemaps.init()))
               .pipe(uglify())
               .pipe(gulpif(dev, sourcemaps.write('./')))
               .pipe(gulp.dest(OUTPUT_DIR));
};

var taskJs = gulp.parallel(taskJsSrc, taskJsServiceWorker);

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
