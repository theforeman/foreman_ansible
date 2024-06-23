import '@testing-library/jest-dom';
import {
  convertedFile0,
  convertedFile1,
  convertedFile0hash,
  convertedFile1hash,
  testAllSelectionTree,
  testCopy,
  testInstalledRoles,
  testNoSelectionTree,
  testSelectionTree,
  testSelectionTreeEvaluated,
} from './testConstants';
import { evaluateTree, treeify } from './YamlVariablesImporterHelpers';

describe('evaluateTree', () => {
  it('should handle an empty selection', () => {
    expect(evaluateTree(testNoSelectionTree)).toMatchObject({});
  });

  it('should handle a normal selection', () => {
    expect(evaluateTree(testSelectionTree)).toEqual(testSelectionTreeEvaluated);
  });
});

describe('treeify', () => {
  it('should handle a normal response', () => {
    const treeifiedFile0 = treeify(
      convertedFile0,
      0,
      convertedFile0hash,
      testInstalledRoles[0]
    );
    const treeifiedFile1 = treeify(
      convertedFile1,
      1,
      convertedFile1hash,
      testInstalledRoles[1]
    );

    expect([treeifiedFile0, treeifiedFile1]).toEqual(testAllSelectionTree);
  });
  it('should handle responses with zero variables', () => {
    const tempTestNoSelectionTree = testCopy(testNoSelectionTree);
    // eslint-disable-next-line no-unused-vars
    for (const tempTestNoSelectionTreeElement of tempTestNoSelectionTree) {
      tempTestNoSelectionTreeElement.count = 0;
      tempTestNoSelectionTreeElement.variables = [];
    }

    const treeifiedFile0 = treeify(
      {},
      0,
      convertedFile0hash,
      testInstalledRoles[0]
    );
    const treeifiedFile1 = treeify(
      {},
      1,
      convertedFile1hash,
      testInstalledRoles[1]
    );

    expect([treeifiedFile0, treeifiedFile1]).toEqual(tempTestNoSelectionTree);
  });
});
