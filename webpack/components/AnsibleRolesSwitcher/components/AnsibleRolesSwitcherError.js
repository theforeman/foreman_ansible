import React from 'react';
import { Alert } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const errorMessage = error => {
  if (!error) return '';
  const status = error.statusText ? `${error.statusText}: ` : '';
  return `${status}${error.errorMsg}`;
};

const AnsibleRolesSwitcherError = ({ error }) =>
  error?.errorMsg ? (
    <Alert
      ouiaId="ansible-roles-switcher-error"
      variant="danger"
      title={errorMessage(error)}
    />
  ) : (
    ''
  );

AnsibleRolesSwitcherError.propTypes = {
  error: PropTypes.shape({
    errorMsg: PropTypes.string,
    statusText: PropTypes.string,
  }),
};

AnsibleRolesSwitcherError.defaultProps = {
  error: {},
};

export default AnsibleRolesSwitcherError;
