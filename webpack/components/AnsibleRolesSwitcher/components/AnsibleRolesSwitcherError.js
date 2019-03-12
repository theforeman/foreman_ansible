import React from 'react';
import { Col, Alert } from 'patternfly-react';
import PropTypes from 'prop-types';

const ErrorMsg = ({ error }) => {
  const status = error.statusText ? `${error.statusText}: ` : '';
  return `${status}${error.errorMsg}`;
};

const AnsibleRolesSwitcherError = ({ error }) =>
  error && error.errorMsg ? (
    <Col sm={12}>
      <Alert type="error">
        <ErrorMsg error={error} />
      </Alert>
    </Col>
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
