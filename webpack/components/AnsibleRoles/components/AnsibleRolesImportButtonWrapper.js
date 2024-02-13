import React from 'react';
import PropTypes from 'prop-types';
import { AnsibleRolesImportButton } from './AnsibleRolesImportButton';

export const AnsibleRolesImportButtonWrapper = props => {
  if (props.apiStatus === 'RESOLVED') {
    if (
      ['import_ansible_roles', 'view_smart_proxies'].every(perm =>
        props.allPermissions.some(requestedPerm => perm === requestedPerm.name)
      )
    ) {
      return <AnsibleRolesImportButton />;
    }
  }
  return null;
};

AnsibleRolesImportButtonWrapper.propTypes = {
  apiStatus: PropTypes.string,
  allPermissions: PropTypes.array,
};

AnsibleRolesImportButtonWrapper.defaultProps = {
  apiStatus: 'PENDING',
  allPermissions: [],
};
