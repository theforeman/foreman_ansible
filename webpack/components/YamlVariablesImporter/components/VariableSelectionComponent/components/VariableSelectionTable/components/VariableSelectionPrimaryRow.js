import React from 'react';
import { Td, TreeRowWrapper } from '@patternfly/react-table';
import PropTypes from 'prop-types';
import { RoleSelectionDropdown } from './RoleSelectionDropdown';

export const VariableSelectionPrimaryRow = props => {
  const level = 1;
  const posinset = 1;
  const { isExpanded } = props;
  const { isDetailsExpanded } = props;

  let isChecked;
  if (props.node.variables.every(n => n.checked)) {
    isChecked = true;
  } else if (props.node.variables.some(n => n.checked)) {
    isChecked = null;
  } else {
    isChecked = false;
  }

  const treeRow = {
    onCollapse: () =>
      props.setExpandedNodeNames(prevExpanded => {
        const otherExpandedNodeNames = prevExpanded.filter(
          name => name !== props.node.internal_id
        );
        return props.isExpanded
          ? otherExpandedNodeNames
          : [...otherExpandedNodeNames, props.node.internal_id];
      }),
    onToggleRowDetails: () =>
      props.setExpandedDetailsNodeNames(prevDetailsExpanded => {
        const otherDetailsExpandedNodeNames = prevDetailsExpanded.filter(
          name => name !== props.node.internal_id
        );
        return isDetailsExpanded
          ? otherDetailsExpandedNodeNames
          : [...otherDetailsExpandedNodeNames, props.node.internal_id];
      }),
    onCheckChange: () => {
      props.node.variables.forEach(v => {
        v.checked = !isChecked;
      });
      props.setTree([...props.tree]);
    },
    props: {
      isExpanded,
      isDetailsExpanded,
      'aria-level': level,
      'aria-posinset': posinset,
      'aria-setsize': props.node.variables ? props.node.variables.length : 0,
      isChecked,
      checkboxId: `checkbox_id_${props.node.internal_id}`,
    },
  };

  return (
    <TreeRowWrapper
      row={{
        props: treeRow.props,
      }}
    >
      <Td dataLabel="Variable" treeRow={treeRow}>
        <RoleSelectionDropdown
          installedRoles={props.installedRoles}
          node={props.node}
          tree={props.tree}
          setTree={props.setTree}
        />
      </Td>
    </TreeRowWrapper>
  );
};

VariableSelectionPrimaryRow.propTypes = {
  isExpanded: PropTypes.bool,
  isDetailsExpanded: PropTypes.bool,
  setExpandedNodeNames: PropTypes.func,
  setExpandedDetailsNodeNames: PropTypes.func,
  node: PropTypes.object,
  setTree: PropTypes.func,
  tree: PropTypes.array,
  installedRoles: PropTypes.array,
};

VariableSelectionPrimaryRow.defaultProps = {
  isExpanded: false,
  isDetailsExpanded: false,
  setExpandedNodeNames: () => {},
  setExpandedDetailsNodeNames: () => {},
  node: {},
  setTree: () => {},
  tree: [],
  installedRoles: [],
};
