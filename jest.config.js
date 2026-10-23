const path = require('path');
const findForemanRoot = require('./findForemanRoot');

const foremanRoot = findForemanRoot();

module.exports = {
  moduleDirectories: [path.join(foremanRoot, 'node_modules'), 'node_modules'],
  transform: {
    '^.+\\.svg$': require.resolve('jest-svg-transformer', {
      paths: [path.join(foremanRoot, 'node_modules')],
    }),
  },
  setupFilesAfterEnv: [path.join(__dirname, 'webpack/test_setup.js')],
};
