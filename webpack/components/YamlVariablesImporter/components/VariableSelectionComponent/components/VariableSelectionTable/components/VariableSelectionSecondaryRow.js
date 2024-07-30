import React from 'react';
import { Td, TreeRowWrapper } from '@patternfly/react-table';
import PropTypes from 'prop-types';
import { VariableNameField } from './VariableNameField';
import { VariableDefaultField } from './VariableDefaultField';

export const VariableSelectionSecondaryRow = props => {
  const isChecked = props.node.checked;
  const { isHidden } = props;
  const level = 2;
  const posinset = 1;

  const treeRow = {
    onCheckChange: () => {
      props.node.checked = !props.node.checked;
      props.setTree([...props.tree]);
    },
    props: {
      isHidden,
      'aria-level': level,
      'aria-posinset': posinset,
      'aria-setsize': 0,
      isChecked,
      checkboxId: `checkbox_id_${props.checkboxId}`,
    },
  };

  return (
    <TreeRowWrapper
      row={{
        props: treeRow.props,
      }}
    >
      <Td dataLabel="Variable" treeRow={treeRow}>
        <VariableNameField
          node={props.node}
          roleName={props.roleName}
          allVariables={props.allVariables}
          tree={props.tree}
          setTree={props.setTree}
        />{' '}
      </Td>
      <Td dataLabel="DefaultValue">
        <VariableDefaultField node={props.node} />
      </Td>
    </TreeRowWrapper>
  );
};

VariableSelectionSecondaryRow.propTypes = {
  node: PropTypes.object,
  isHidden: PropTypes.bool,
  setTree: PropTypes.func,
  tree: PropTypes.array,
  roleName: PropTypes.string,
  checkboxId: PropTypes.number,
  allVariables: PropTypes.array,
};

VariableSelectionSecondaryRow.defaultProps = {
  node: {},
  isHidden: false,
  setTree: () => {},
  tree: [],
  roleName: '',
  checkboxId: 0,
  allVariables: [],
};
