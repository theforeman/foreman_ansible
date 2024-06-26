import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { showToast } from '../../../toastHelper';
import { AnsibleRolesImportButton } from './AnsibleRolesImportButton';

export const AnsibleRolesImportButtonWrapper = () => {
  const {
    response: { results },
    status,
  } = useAPI('get', '/api/v2/permissions/current_permissions');

  if (status === 'ERROR') {
    showToast({
      type: 'error',
      message: __('There was an error requesting user permissions'),
    });
    return null;
  } else if (status === 'RESOLVED') {
    if (
      ['import_ansible_roles', 'view_smart_proxies'].every(perm =>
        results.some(requestedPerm => perm === requestedPerm.name)
      )
    ) {
      return <AnsibleRolesImportButton />;
    }
  }
  return null;
};
