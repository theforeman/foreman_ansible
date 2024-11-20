import React from 'react';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import TableIndexPage from 'foremanReact/components/PF4/TableIndexPage/TableIndexPage';
import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';
import { translate as __ } from 'foremanReact/common/I18n';
import { getDocsURL } from 'foremanReact/common/helpers';
import {
  hostgroupsLink,
  hostsLink,
  variablesLink,
} from './AnsibleRolesPageHelpers';
import { AnsibleRolesImportButtonWrapper } from './components/AnsibleRolesImportButtonWrapper';
import { showToast } from '../../toastHelper';

export const AnsibleRolesPage = () => {
  const {
    response: { results },
    status,
  } = useAPI('get', '/api/v2/permissions/current_permissions');

  if (status === 'ERROR') {
    showToast({
      type: 'error',
      message: __('There was an error requesting user permissions'),
    });
  }

  return (
    <TableIndexPage
      header={__('Ansible Roles')}
      controller="ansible_roles"
      apiUrl="/ansible/ui_ansible_roles"
      apiOptions={{ key: 'ANSIBLE_ROLES_API_REQUEST_KEY' }}
      hasHelpPage
      creatable={false}
      isDeleteable
      customToolbarItems={
        <AnsibleRolesImportButtonWrapper
          apiStatus={status}
          allPermissions={results}
        />
      }
      customHelpURL={getDocsURL(
        'Managing_Configurations_Ansible',
        'Importing_Ansible_Roles_and_Variables_ansible'
      )}
      columns={{
        name: { title: __('Name'), isSorted: true, weight: 0 },
        hostgroups_count: {
          title: __('Hostgroups'),
          weight: 1,
          wrapper: ({ name, hostgroups_count: hostgroupsCount }) =>
            hostgroupsLink(name, hostgroupsCount, status, results),
        },
        hosts_count: {
          title: __('Hosts'),
          weight: 2,
          wrapper: ({ name, hosts_count: hostsCount }) =>
            hostsLink(name, hostsCount, status, results),
        },
        variables_count: {
          title: __('Variables'),
          weight: 3,
          wrapper: ({ name, variables_count: variablesCount }) =>
            variablesLink(name, variablesCount, status, results),
        },
        updated_at: {
          title: __('Imported at'),
          isSorted: true,
          weight: 4,
          wrapper: ({ updated_at: updatedAt }) => (
            <RelativeDateTime date={new Date(updatedAt)} />
          ),
        },
      }}
    />
  );
};
