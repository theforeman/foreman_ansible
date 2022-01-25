import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import { post } from 'foremanReact/redux/API';
import { push } from 'connected-react-router';
import { prepareResult } from './AnsibleRolesAndVariablesHelpers';
import {
  IMPORT_ANSIBLE_V_R,
  ANSIBLE_ROLE_CONFIRM_IMPORT_PATH,
  ANSIBLE_ROLES_INDEX,
} from './AnsibleRolesAndVariablesConstants';

export const foremanUrl = path => `${window.URL_PREFIX}${path}`;

export const onSubmit = (rows, proxy) => dispatch => {
  const params = prepareResult(rows);
  dispatch(
    post({
      key: IMPORT_ANSIBLE_V_R,
      url: ANSIBLE_ROLE_CONFIRM_IMPORT_PATH,
      params: { changed: params, proxy },
      handleSuccess: () => {
        setTimeout(() => dispatch(push(ANSIBLE_ROLES_INDEX)), 500);
      },
      successToast: response => (
        <span>
          {__('Import roles and variables started: ')}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={foremanUrl(`/foreman_tasks/tasks/${response.data?.task?.id}`)}
          >
            {__('view the task in progress')}
          </a>
        </span>
      ),
      errorToast: error =>
        `${__('Failed to import roles and variables ')} ${error}`,
    })
  );
};
