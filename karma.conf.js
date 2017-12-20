module.exports = function (config)
{
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files:
        [
            'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.18.0/math.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css',
            'js/**/!(main).js',
            'tests/common.js',
            'tests/*.test.js'
        ],
        exclude: [],
        preprocessors: { 'js/**/*.js': 'coverage'},
        reporters: [ 'progress', 'coverage' ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome', 'Firefox' ],
        singleRun: true,
        concurrency: Infinity
    });
};
