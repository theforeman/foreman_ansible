import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { showToast } from '../../../../toastHelper';

export const formatError = error =>
  sprintf(
    __(
      'There was a following error when changing Ansible variable override: %s'
    ),
    error
  );

export const joinErrors = errors => errors.map(err => err.message).join(', ');

export const onCompleted = (
  dataPath,
  onValidationError,
  toggleWorking,
  onSubmitSuccess
) => data => {
  const { errors, overridenAnsibleVariable } = data[dataPath];
  if (Array.isArray(errors) && errors.length > 0) {
    if (
      errors.length === 1 &&
      errors[0].path.join(' ') === 'attributes value'
    ) {
      onValidationError(errors[0].message);
    } else {
      toggleWorking(false);
      showToast({
        type: 'error',
        message: formatError(joinErrors(errors)),
      });
    }
  } else {
    onSubmitSuccess(overridenAnsibleVariable.currentValue.value);
    showToast({
      type: 'success',
      message: __('Ansible variable override successfully changed.'),
    });
  }
};

export const onError = toggleWorking => error => {
  toggleWorking(false);
  showToast({ type: 'error', message: formatError(error.message) });
};

export const hasError = state => state.validation.key === 'error';
export const createMatcher = value => `fqdn=${value}`;
