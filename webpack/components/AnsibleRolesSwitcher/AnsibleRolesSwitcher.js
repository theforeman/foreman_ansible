import React, { useEffect } from 'react';
import { lowerCase } from 'lodash';
import PropTypes from 'prop-types';
import { Spinner } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

import DualList from '../DualList';
import AnsibleRolesSwitcherError from './components/AnsibleRolesSwitcherError';
import AnsibleRoleInputs from './components/AnsibleRoleInputs';
import InheritedRolesList from './components/InheritedRolesList';
import { roleNames } from './AnsibleRolesSwitcherHelpers';
import './AnsibleRolesSwitcher.scss';

const AnsibleRolesSwitcher = ({
  initialAssignedRoles,
  availableRolesUrl,
  inheritedRoleIds,
  resourceId,
  resourceName,
  getAnsibleRoles,
  loading,
  assignedRoles,
  unassignedRoles,
  toDestroyRoles,
  dualListChange,
  error,
}) => {
  useEffect(() => {
    getAnsibleRoles(
      availableRolesUrl,
      initialAssignedRoles,
      inheritedRoleIds,
      resourceId,
      resourceName,
      { perPage: 'all' }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const inheritedRoles = assignedRoles.filter(role => role.inherited);
  const ownAssignedRoles = assignedRoles.filter(role => !role.inherited);
  const resourceNameLower = lowerCase(resourceName || '');

  const onListChange = (_availableNames, chosenNames) =>
    dualListChange(chosenNames);

  const ownRolesForInputs = ownAssignedRoles.concat(toDestroyRoles);

  return (
    <div id="ansibleRolesSwitcher">
      <AnsibleRolesSwitcherError error={error} />
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <InheritedRolesList
            roles={inheritedRoles}
            resourceName={resourceNameLower}
          />
          <DualList
            availableOptions={roleNames(unassignedRoles)}
            chosenOptions={roleNames(ownAssignedRoles)}
            onListChange={onListChange}
          />
          <p className="ansible-roles-order-info">
            <InfoCircleIcon
              className="ansible-roles-order-info-icon"
              aria-hidden
            />
            <span>
              {__(
                'Use drag and drop to change order of the assigned roles. Ordering of roles is respected for Ansible runs, inherited roles are always before those assigned directly'
              )}
            </span>
          </p>
          <div className="ansible-roles-hidden-inputs">
            {ownRolesForInputs.map((role, idx) => (
              <AnsibleRoleInputs
                key={role.id}
                role={role}
                idx={idx}
                resourceName={resourceNameLower}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

AnsibleRolesSwitcher.propTypes = {
  initialAssignedRoles: PropTypes.arrayOf(PropTypes.object),
  availableRolesUrl: PropTypes.string.isRequired,
  inheritedRoleIds: PropTypes.arrayOf(PropTypes.number),
  resourceId: PropTypes.number,
  resourceName: PropTypes.string,
  getAnsibleRoles: PropTypes.func.isRequired,
  dualListChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  assignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  toDestroyRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  unassignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  error: PropTypes.shape({
    errorMsg: PropTypes.string,
    statusText: PropTypes.string,
  }),
};

AnsibleRolesSwitcher.defaultProps = {
  error: {},
  resourceId: null,
  resourceName: '',
  initialAssignedRoles: [],
  inheritedRoleIds: [],
};

export default AnsibleRolesSwitcher;
