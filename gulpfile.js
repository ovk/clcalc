var gulp            = require('gulp'),
    less            = require('gulp-less'),
    uglify          = require('gulp-uglify'),
    gulpif          = require('gulp-if'),
    connect         = require('gulp-connect'),
    concat          = require('gulp-concat'),
    pug             = require('gulp-pug'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleancss        = require('gulp-clean-css'),
    sourcemaps      = require('gulp-sourcemaps'),
    eslint          = require('gulp-eslint'),
    dev             = false,
    OUTPUT_DIR      = './dist';

/**
 * Copy static assets to the output folder.
 */
gulp.task('assets', function ()
{
    return gulp.src([ './images/favicon.ico', './images/brand.png', './images/gitlab.png', './images/checkerboard.png' ])
               .pipe(gulp.dest(OUTPUT_DIR));
});

/**
 * Generate CSS bundle from the LESS source files.
 */
gulp.task('styles', function ()
{
    var l = less();
    l.on('error',function (e)
    {
        process.stderr.write(e.toString() + '\n');
        process.exit(1);
    });

    return gulp.src('./styles/main.less')
               .pipe(l)
               .pipe(autoprefixer({ 'browsers': '>= 5%', 'cascade': false }))
               .pipe(cleancss({ 'compatibility': 'ie8' }))
               .pipe(gulp.dest(OUTPUT_DIR));
});

/**
 * Generate HTML files from the PUG source files.
 */
gulp.task('html', function ()
{
    return gulp.src([ './pages/*.pug', '!./pages/page.pug', '!./pages/config.pug' ])
               .pipe(pug({ 'pretty': dev }))
               .pipe(gulp.dest(OUTPUT_DIR));
});

/**
 * Generate JavaScript bundle from source files.
 */
gulp.task('js', function()
{
    return gulp.src([ './js/**/*.js' ])
               .pipe(gulpif(dev, sourcemaps.init()))
               .pipe(concat('calc.js'))
               .pipe(uglify())
               .pipe(gulpif(dev, sourcemaps.write('./')))
               .pipe(gulp.dest(OUTPUT_DIR));
});

/**
 * Start development web server.
 */
gulp.task('webserver', function()
{
    connect.server({ 'root': OUTPUT_DIR, 'livereload': false });
});

/**
 * Watch for changes in source files and re-run corresponding tasks.
 */
gulp.task('watch', function()
{
    gulp.watch('./styles/*.less', [ 'styles' ]);
    gulp.watch('./js/**/*.js', [ 'js' ]);
    gulp.watch('./pages/*.pug', [ 'html' ]);
});

/**
 * Default Gulp task: builds release version.
 */
gulp.task('default', [ 'assets', 'html', 'styles', 'js' ]);

/**
 * Build development version, start web server and watch for changes in source files.
 * In development version sourcemaps for JavaScript files are generated and generated HTML is beautified.
 */
gulp.task('dev', function ()
{
    dev = true;

    gulp.start('default');
    gulp.start('webserver');
    gulp.start('watch');
});

/**
 * Run eslint against JavaScript source files.
 */
gulp.task('eslint', function ()
{
    return gulp.src([ './js/**/*.js' ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
