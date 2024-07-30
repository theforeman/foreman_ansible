import React from 'react';
import { TableComposable, Thead, Tr, Th, Tbody } from '@patternfly/react-table';
import PropTypes from 'prop-types';
import { Popover } from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';
import styles from '@patternfly/react-styles/css/components/Form/form';
import { VariableSelectionSecondaryRow } from './VariableSelectionTable/components/VariableSelectionSecondaryRow';
import { VariableSelectionPrimaryRow } from './VariableSelectionTable/components/VariableSelectionPrimaryRow';

export const VariableSelectionSubMenu = props => {
  const [expandedNodeNames, setExpandedNodeNames] = React.useState([]);
  const [
    expandedDetailsNodeNames,
    setExpandedDetailsNodeNames,
  ] = React.useState([]);
  const [installedVariables, setInstalledVariables] = React.useState({});

  const renderPrimaryRows = (
    [node, ...remainingNodes],
    level = 1,
    posinset = 1,
    rowIndex = 0,
    isHidden = false
  ) => {
    if (!node) {
      return [];
    }
    const isExpanded = expandedNodeNames.includes(node.internal_id);
    const isDetailsExpanded = expandedDetailsNodeNames.includes(
      node.internal_id
    );

    const childRows =
      node.variables && node.variables.length
        ? renderSecondaryRows(
            node.variables,
            level + 1,
            1,
            rowIndex + 1,
            !isExpanded || isHidden,
            node.assign_to,
            node.variables
          )
        : [];
    return [
      <VariableSelectionPrimaryRow
        key={node.internal_id}
        node={node}
        setTree={props.setTree}
        tree={props.tree}
        isExpanded={isExpanded}
        isDetailsExpanded={isDetailsExpanded}
        setExpandedNodeNames={setExpandedNodeNames}
        setExpandedDetailsNodeNames={setExpandedDetailsNodeNames}
        installedRoles={props.installedRoles}
        installedVariables={installedVariables}
        setInstalledVariables={setInstalledVariables}
      />,

      ...childRows,
      ...renderPrimaryRows(
        remainingNodes,
        level,
        posinset + 1,
        rowIndex + 1 + childRows.length,
        isHidden
      ),
    ];
  };

  const renderSecondaryRows = (
    [node, ...remainingNodes],
    level = 1,
    posinset = 1,
    rowIndex = 0,
    isHidden = false,
    roleName,
    allVariablesRef
  ) => {
    if (!node) {
      return [];
    }

    return [
      <VariableSelectionSecondaryRow
        key={rowIndex}
        node={node}
        setTree={props.setTree}
        tree={props.tree}
        isHidden={isHidden}
        roleName={roleName}
        checkboxId={rowIndex}
        allVariables={allVariablesRef}
      />,

      ...renderSecondaryRows(
        remainingNodes,
        level,
        posinset + 1,
        rowIndex + 1,
        isHidden,
        roleName,
        allVariablesRef
      ),
    ];
  };

  return (
    <TableComposable isTreeTable aria-label="Tree table">
      <Thead>
        <Tr>
          <Th width={40}>Roles/Variables</Th>
          <Th width={40}>
            Default Value{' '}
            <Popover
              headerContent={<div>Inputs are not checked for validity.</div>}
            >
              <button
                type="button"
                aria-label="More info for name field"
                onClick={e => e.preventDefault()}
                aria-describedby="simple-form-name-01"
                className={styles.formGroupLabelHelp}
              >
                <HelpIcon />
              </button>
            </Popover>
          </Th>
        </Tr>
      </Thead>
      <Tbody>{renderPrimaryRows(props.tree)}</Tbody>
    </TableComposable>
  );
};

VariableSelectionSubMenu.propTypes = {
  tree: PropTypes.array,
  setTree: PropTypes.func,
  installedRoles: PropTypes.array,
};

VariableSelectionSubMenu.defaultProps = {
  tree: [],
  setTree: () => {},
  installedRoles: [],
};
