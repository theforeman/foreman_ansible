import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { deepPropsToCamelCase } from 'foremanReact/common/helpers';

import AnsibleHostParams from './AnsibleHostParams';
import {
  selectAssignedVariables,
  selectVariablesLoading,
  selectFormObject,
} from '../AnsibleRolesSwitcher/AnsibleRolesSwitcherSelectors';

const WrappedAnsibleHostParams = props => {
  const loading = useSelector(state => selectVariablesLoading(state));
  const assignedRoles = useSelector(state => selectAssignedVariables(state));
  const formObject = useSelector(state => selectFormObject(state));

  return (
    <AnsibleHostParams
      loading={loading}
      assignedRoles={assignedRoles}
      resourceErrors={deepPropsToCamelCase(props.lookup_values).filter(
        val => Object.keys(val.errors).length > 0
      )}
      formObject={formObject}
      highlightTabErrors={window.tfm.tools.highlightTabErrors}
    />
  );
};

WrappedAnsibleHostParams.propTypes = {
  lookup_values: PropTypes.array,
};

WrappedAnsibleHostParams.defaultProps = {
  lookup_values: [],
};

export default WrappedAnsibleHostParams;
