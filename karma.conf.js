const webpackConfig = require('./webpack.config.test');

module.exports = (config) => {
  const tests = 'tests/*.spec.ts';

  config.set({
    frameworks: ['mocha'],

    files: [{
      pattern: tests,
    }],

    preprocessors: {
      [tests]: ['webpack'],
    },

    singleRun: false,

    reporters: ['mocha'],

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only',
    },

    mochaReporter: {
      showDiff: true,
    },
  });
};
