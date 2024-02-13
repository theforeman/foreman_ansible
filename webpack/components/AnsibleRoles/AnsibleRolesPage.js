import React from 'react';
import TableIndexPage from 'foremanReact/components/PF4/TableIndexPage/TableIndexPage';
import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';
import { translate as __ } from 'foremanReact/common/I18n';
import { getDocsURL } from 'foremanReact/common/helpers';
import { getActions } from './AnsibleRolesPageHelpers';
import { AnsibleRolesImportButtonWrapper } from './components/AnsibleRolesImportButtonWrapper';

export const AnsibleRolesPage = () => (
  <TableIndexPage
    header={__('Ansible Roles')}
    controller="ansible_roles"
    apiUrl="/ansible/ui_ansible_roles"
    apiOptions={{ key: 'ANSIBLE_ROLES_API_REQUEST_KEY' }}
    hasHelpPage
    creatable={false}
    isDeleteable
    searchable
    customToolbarItems={<AnsibleRolesImportButtonWrapper />}
    customHelpURL={getDocsURL(
      'Managing_Configurations_Ansible',
      'Importing_Ansible_Roles_and_Variables_ansible'
    )}
    rowKebabItems={getActions}
    columns={{
      name: { title: __('Name'), isSorted: true, weight: 0 },
      hostgroups_count: { title: __('Hostgroups'), weight: 1 },
      hosts_count: { title: __('Hosts'), weight: 2 },
      variables_count: { title: __('Variables'), weight: 3 },
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
