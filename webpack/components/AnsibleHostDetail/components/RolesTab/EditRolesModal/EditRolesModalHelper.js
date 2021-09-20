import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { decodeModelId } from '../../../../../globalIdHelper';
import { showToast } from '../../../../../toastHelper';

export const roleNamesToIds = (roles, names) =>
  names.reduce((memo, name) => {
    const role = roles.find(item => item.name === name);
    if (role) {
      memo.push(decodeModelId(role));
    }
    return memo;
  }, []);

const joinErrors = errors => errors.map(err => err.message).join(', ');

const formatError = error =>
  sprintf(
    __('There was a following error when assigning Ansible Roles: %s'),
    error
  );

export const onCompleted = closeModal => data => {
  const { errors } = data.assignAnsibleRoles;
  if (Array.isArray(errors) && errors.length > 0) {
    showToast({
      type: 'error',
      message: formatError(joinErrors(errors)),
    });
  } else {
    closeModal();
    showToast({
      type: 'success',
      message: __('Ansible Roles were successfully assigned.'),
    });
  }
};

export const onError = error => {
  showToast({ type: 'error', message: formatError(error) });
};
