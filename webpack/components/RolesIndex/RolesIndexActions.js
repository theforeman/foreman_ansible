import { APIActions } from 'foremanReact/redux/API';
import { translate as __ } from 'foremanReact/common/I18n';
import { ANSIBLE_ROLES_API } from './RolesIndexConstants';

export const foremanUrl = path => `${window.URL_PREFIX}${path}`;

export const onDelete = role =>
  APIActions.delete({
    key: 'delete_ansible_role',
    url: `${ANSIBLE_ROLES_API}${role.id}`,
    handleSuccess: () => window.location.reload(),
    successToast: response => `Role ${role.name} was successfully deleted`,
    errorToast: error =>
      `${__('Failed to import roles and variables ')} ${error}`,
  });
