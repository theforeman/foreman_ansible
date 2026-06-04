import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnsiblePermissionDenied from './AnsiblePermissionDenied';

/* eslint-disable global-require, react/prop-types, react/require-default-props */
jest.mock('foremanReact/components/common/EmptyState', () => {
  const PropTypes = require('prop-types');

  const EmptyStatePattern = ({
    header = null,
    description = null,
    documentation = null,
  }) => (
    <div data-ouia-component-type="empty-state">
      <h1>{header}</h1>
      {description}
      {documentation}
    </div>
  );

  EmptyStatePattern.propTypes = {
    header: PropTypes.string,
    description: PropTypes.node,
    documentation: PropTypes.node,
  };

  return { EmptyStatePattern };
});
/* eslint-enable global-require, react/prop-types, react/require-default-props */

describe('AnsiblePermissionDenied', () => {
  it('renders a permission denied message', () => {
    render(<AnsiblePermissionDenied />);

    expect(screen.getByText('Permission Denied')).toBeInTheDocument();
    expect(
      screen.getByText(/You are not authorized to perform this action/)
    ).toBeInTheDocument();
    expect(screen.getByText('view_ansible_roles')).toBeInTheDocument();
  });
});
