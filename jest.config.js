const tfmConfig = require('@theforeman/test/src/pluginConfig');

// Find where foreman is located
const { foremanRelativePath, foremanLocation } = require('@theforeman/find-foreman');
const foremanReactRelative = 'webpack/assets/javascripts/react_app';
const foremanFull = foremanLocation();
const foremanReactFull = foremanRelativePath(foremanReactRelative);

// Makes graphql files work in test
tfmConfig.transform["\\.(gql|graphql)$"] = "jest-transform-graphql";

// Find correct path to foremanReact so we do not have to mock it in tests
tfmConfig.moduleNameMapper['^foremanReact(.*)$'] = `${foremanReactFull}/$1`;

// Do not use default resolver
tfmConfig.resolver = null;
// Specify module dirs instead
tfmConfig.moduleDirectories = [
  `${foremanFull}/node_modules`,
  `${foremanFull}/node_modules/@theforeman/vendor-core/node_modules`,
  'node_modules',
]

module.exports = tfmConfig;
