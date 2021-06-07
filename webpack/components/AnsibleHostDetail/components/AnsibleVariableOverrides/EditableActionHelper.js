import { translate as __, sprintf } from 'foremanReact/common/I18n';

export const formatError = error =>
  sprintf(
    __(
      'There was a following error when updating Ansible variable override: %s'
    ),
    error
  );

export const joinErrors = errors => errors.map(err => err.message).join(', ');
