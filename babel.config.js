const path = require('path');
const findForemanRoot = require('./findForemanRoot');

const resolveFromForeman = (entry, foremanPath) => {
  if (typeof entry === 'string') {
    return require.resolve(entry, { paths: [foremanPath] });
  }

  if (Array.isArray(entry)) {
    return [resolveFromForeman(entry[0], foremanPath), ...entry.slice(1)];
  }

  return entry;
};

const resolveConfigEntries = (entries, foremanPath) =>
  (entries || []).map(entry => resolveFromForeman(entry, foremanPath));

module.exports = api => {
  api.cache(true);

  const foremanPath = findForemanRoot(__dirname);
  const foremanConfigPath = path.join(foremanPath, 'babel.config.js');
  const loaded = require(foremanConfigPath);
  const foremanConfig = typeof loaded === 'function' ? loaded(api) : loaded;

  return {
    ...foremanConfig,
    presets: resolveConfigEntries(foremanConfig.presets, foremanPath),
    plugins: resolveConfigEntries(foremanConfig.plugins, foremanPath),
  };
};
