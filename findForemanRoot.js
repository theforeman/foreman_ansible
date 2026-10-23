const path = require('path');
const fs = require('fs');

const FOREMAN_MARKER = path.join('webpack', 'jest.config.js');

const isForemanRoot = dir => fs.existsSync(path.join(dir, FOREMAN_MARKER));

const findForemanRoot = (startDir = __dirname) => {
  const namedCandidates = ['./foreman', '../foreman', '../../foreman'].map(
    relativePath => path.resolve(startDir, relativePath)
  );

  const namedForeman = namedCandidates.find(
    candidate => fs.existsSync(candidate) && isForemanRoot(candidate)
  );

  if (namedForeman) {
    return namedForeman;
  }

  let current = path.resolve(startDir);
  const filesystemRoot = path.parse(current).root;

  while (current !== filesystemRoot) {
    if (isForemanRoot(current)) {
      return current;
    }

    current = path.dirname(current);
  }

  throw new Error(
    'Foreman directory cannot be found. Expected a Foreman checkout as a sibling ' +
      '(../foreman), nested under Foreman (for example plugins/<plugin>), or any ancestor ' +
      'directory that contains webpack/jest.config.js.'
  );
};

module.exports = findForemanRoot;
