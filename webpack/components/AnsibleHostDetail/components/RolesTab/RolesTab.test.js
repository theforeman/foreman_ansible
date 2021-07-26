import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/react-testing';

import ansibleRolesQuery from '../../../../graphql/queries/ansibleRoles.gql';

import RolesTab from './';

const mocks = [
  {
    request: {
      query: ansibleRolesQuery,
      variables: {
        search: 'host_id = 3',
      },
    },
    result: {
      data: {
        ansibleRoles: {
          nodes: [
            {
              id: 'MDE6QW5zaWJsZVJvbGUtMw==',
              name: 'aardvaark.cube',
            },
            {
              id: 'MDE6QW5zaWJsZVJvbGUtNQ==',
              name: 'aardvaark.sphere',
            },
            {
              id: 'MDE6QW5zaWJsZVJvbGUtMzA=',
              name: 'another.role',
            },
          ],
        },
      },
    },
  },
];

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

const TestComponent = props => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <RolesTab {...props} />
  </MockedProvider>
);

describe('RolesTab', () => {
  it('should load Ansible Roles', async () => {
    render(<TestComponent hostId={3} />);
    await waitFor(tick);
    expect(screen.getByText('aardvaark.cube')).toBeInTheDocument();
    expect(screen.getByText('aardvaark.sphere')).toBeInTheDocument();
    expect(screen.getByText('another.role')).toBeInTheDocument();
  });
});
