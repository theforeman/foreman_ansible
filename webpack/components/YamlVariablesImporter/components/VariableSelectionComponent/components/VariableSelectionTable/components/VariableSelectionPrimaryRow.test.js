import React from 'react';
import '@testing-library/jest-dom';
import { TableComposable, Tbody } from '@patternfly/react-table';
import { render, fireEvent } from '@testing-library/react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { VariableSelectionPrimaryRow } from './VariableSelectionPrimaryRow';
import {
  testInstalledRoles,
  testNoSelectionTree,
  testFileNode,
  testCopy,
} from '../../../../../testConstants';
import * as helpers from '../../../../../YamlVariablesImporterHelpers';

describe('VariableSelectionPrimaryRow', () => {
  const isExpanded = false;
  const isDetailsExpanded = false;
  const setExpandedNodeNames = () => {};
  const setExpandedDetailsNodeNames = () => {};
  const node = testFileNode;
  const setTree = () => {};
  const tree = testNoSelectionTree;
  const installedRoles = testInstalledRoles;
  jest.spyOn(helpers, 'duplicatesInstalled').mockImplementation(() => false);
  jest.spyOn(helpers, 'duplicatesLocal').mockImplementation(() => []);

  it('should render the primary row', () => {
    const { container } = render(
      <TableComposable isTreeTable aria-label="Tree table">
        <Tbody>
          <VariableSelectionPrimaryRow
            isExpanded={isExpanded}
            isDetailsExpanded={isDetailsExpanded}
            setExpandedNodeNames={setExpandedNodeNames}
            setExpandedDetailsNodeNames={setExpandedDetailsNodeNames}
            node={node}
            setTree={setTree}
            tree={tree}
            installedRoles={installedRoles}
          />
        </Tbody>
      </TableComposable>
    );

    const roleSelectorDropdownBtn = container.querySelector(
      '.pf-c-menu-toggle'
    );

    expect(container).toBeInTheDocument();
    expect(
      roleSelectorDropdownBtn.querySelector('.pf-c-menu-toggle__text')
    ).toHaveTextContent(testFileNode.assign_to);
  });

  it('should handle checking all', async () => {
    const tempNode = testCopy(node);

    const { container } = render(
      <TableComposable isTreeTable aria-label="Tree table">
        <Tbody>
          <VariableSelectionPrimaryRow
            isExpanded={isExpanded}
            isDetailsExpanded={isDetailsExpanded}
            setExpandedNodeNames={setExpandedNodeNames}
            setExpandedDetailsNodeNames={setExpandedDetailsNodeNames}
            node={tempNode}
            setTree={setTree}
            tree={tree}
            installedRoles={installedRoles}
          />
        </Tbody>
      </TableComposable>
    );

    const selectAllBox = container.querySelector('.pf-c-check__input');

    // eslint-disable-next-line no-unused-vars
    for (const variable of tempNode.variables) {
      expect(variable.checked).toBe(false);
    }

    await fireEvent.click(selectAllBox);

    // eslint-disable-next-line no-unused-vars
    for (const variable of tempNode.variables) {
      expect(variable.checked).toBe(true);
    }
  });
});
