import React from 'react';
import { Col, Alert } from 'patternfly-react';

const ErrorMsg = ({ error }) => {
  const status = error.statusText ? `${error.statusText}: ` : '';
  return `${status}${error.errorMsg}`;
};

const AnsibleRolesSwitcherError = ({ error }) => (
  error && error.errorMsg ?
    (
      <Col sm={12} >
        <Alert type='error'>
           <ErrorMsg error={error} />
        </Alert>
      </Col>
    ) :
    '');

export default AnsibleRolesSwitcherError;
