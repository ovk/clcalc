module.exports = function (config)
{
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files:
        [
            'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.3.2/math.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.min.css',
            'js/**/!(main).js',
            'tests/common.js',
            'tests/*.test.js'
        ],
        exclude: [],
        preprocessors: { 'js/**/*.js': 'coverage'},
        reporters: [ 'progress', 'coverage' ],
        coverageReporter:
        {
            type: 'lcov',
            dir: 'coverage'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['ChromeHeadlessNoSandbox', 'FirefoxHeadless' ],
        customLaunchers:
        {
            ChromeHeadlessNoSandbox:
            {
                base: 'ChromeHeadless',
                flags: [ '--no-sandbox' ]
            }
        },
        singleRun: true,
        concurrency: Infinity
    });
};
