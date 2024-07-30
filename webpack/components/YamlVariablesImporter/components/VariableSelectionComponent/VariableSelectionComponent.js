import React from 'react';
import PropTypes from 'prop-types';

import { VariableSelectionSubMenu } from './components/VariableSelectionSubMenu';

export const VariableSelectionComponent = props => (
  <VariableSelectionSubMenu
    tree={props.tree}
    setTree={props.setTree}
    installedRoles={props.installedRoles}
  />
);

VariableSelectionComponent.propTypes = {
  tree: PropTypes.array,
  setTree: PropTypes.func,
  installedRoles: PropTypes.array,
};

VariableSelectionComponent.defaultProps = {
  tree: [],
  setTree: () => {},
  installedRoles: [],
};
