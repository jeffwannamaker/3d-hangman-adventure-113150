const path = require('path');

/**
 * PUBLIC_INTERFACE
 * CRACO configuration to suppress source map parse warnings for node_modules,
 * such as for @mediapipe/tasks-vision, by ignoring warnings of type 'source-map'.
 */
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Only set ignoreWarnings for Webpack 5+
      webpackConfig.ignoreWarnings = [
        (warning) => {
          // Suppress source map warnings for node_modules (e.g., @mediapipe/tasks-vision)
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes('node_modules') &&
            warning.message &&
            /Failed to parse source map/.test(warning.message)
          );
        },
      ];
      return webpackConfig;
    },
  },
};
