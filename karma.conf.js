const karmaTestMiddleware = require('./test/helpers/karma-test-middleware.js')

// Reference: http://karma-runner.github.io/0.13/config/configuration-file.html
module.exports = function karmaConfig (config) {
  config.set({
    browsers: [
      // 'Firefox',
      'Chrome'
      // 'ChromeHeadless'
    ],

    singleRun: true,

    autoWatch: true,

    frameworks: [
      // Reference: https://github.com/karma-runner/karma-mocha
      // Set framework to mocha
      'mocha'
    ],

    reporters: ['progress', 'coverage-istanbul'],

    coverageIstanbulReporter: {
      reports: ['text', 'html'],
      fixWebpackSourcePaths: true
    },

    files: [
      // Grab all files in the tests directory that contain _test.
      'test/browser.test.js',
      'test/Format.test.js',
      'test/utils.test.js'
    ],

    preprocessors: {
      // Reference: http://webpack.github.io/docs/testing.html
      // Reference: https://github.com/webpack/karma-webpack
      // Convert files with webpack and load sourcemaps
      'test/*.test.js': ['webpack', 'sourcemap']
    },

    // Configure code coverage reporter
    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage/'},
        {type: 'text'}
      ]
    },

    client: {
      mocha: {
        reporter: 'html',
        opts: './test/mocha.opts'
      }
    },

    middleware: ['test'],

    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-spec-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-sourcemap-loader',
      'karma-coverage',
      'karma-coverage-istanbul-reporter',
      {'middleware:test': ['factory', karmaTestMiddleware]}
    ],

    // Test webpack config
    webpack: require('./webpack.config'),

    // Hide webpack build information from output
    webpackMiddleware: {
      noInfo: true
    }
  })
}
