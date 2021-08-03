import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/react-testing';
import { MemoryRouter } from 'react-router-dom';

import variableOverridesQuery from '.../../../../graphql/queries/variableOverrides.gql';
import AnsibleVariableOverrides from './index';

const hostId = 3;
const hostGlobalId = 'MDE6SG9zdC0z';

const mocks = [
  {
    request: {
      query: variableOverridesQuery,
      variables: {
        id: hostGlobalId,
        hostId,
      },
    },
    result: {
      data: {
        host: {
          allAnsibleRoles: {
            nodes: [
              {
                ansibleVariablesWithOverrides: {
                  nodes: [],
                },
              },
              {
                name: 'another.role',
                ansibleVariablesWithOverrides: {
                  nodes: [
                    {
                      key: 'rectangle',
                      defaultValue: 17,
                      parameterType: 'integer',
                      ansibleRoleName: 'test.role',
                      currentValue: {
                        value: 101,
                        element: 'os',
                        elementName: 'CentOS 7.9',
                        meta: {
                          canEdit: true,
                        },
                      },
                    },
                    {
                      key: 'square',
                      defaultValue: true,
                      parameterType: 'boolean',
                      ansibleRoleName: 'test.role',
                      currentValue: null,
                    },
                    {
                      key: 'circle',
                      defaultValue: 'd',
                      parameterType: 'string',
                      ansibleRoleName: 'test.role',
                      currentValue: {
                        value: 'c',
                        element: 'domain',
                        elementName: 'example.com',
                        meta: {
                          canEdit: true,
                        },
                      },
                    },
                    {
                      key: 'ellipse',
                      defaultValue: ['seven', 'eight'],
                      parameterType: 'array',
                      ansibleRoleName: 'test.role',
                      currentValue: {
                        value: ['nine'],
                        element: 'hostgroup',
                        elementName: 'parent hostgroup',
                        meta: {
                          canEdit: false,
                        },
                      },
                    },
                    {
                      key: 'spiral',
                      defaultValue: { one: 'one', two: 'two' },
                      parameterType: 'hash',
                      ansibleRoleName: 'test.role',
                      currentValue: null,
                    },
                    {
                      key: 'sun',
                      defaultValue: "{ one: 'one', two: 'two' }",
                      parameterType: 'json',
                      ansibleRoleName: 'test.role',
                      currentValue: null,
                    },
                    {
                      key: 'moon',
                      defaultValue: [
                        { hosts: 'all', become: 'true', roles: ['foo'] },
                      ],
                      parameterType: 'yaml',
                      ansibleRoleName: 'test.role',
                      currentValue: null,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
];

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

const TestComponent = props => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <AnsibleVariableOverrides {...props} />
  </MockedProvider>
);

describe('AnsibleVariableOverrides', () => {
  it('should show skeleton when page is loading', () => {
    const { container } = render(
      <TestComponent status="PENDING" id={hostId} />
    );
    expect(
      container.getElementsByClassName('react-loading-skeleton')
    ).toHaveLength(5);
  });
  it('should load', async () => {
    render(
      <MemoryRouter>
        <TestComponent status="RESOLVED" id={hostId} />
      </MemoryRouter>
    );
    await waitFor(tick);
    expect(screen.getByText('rectangle')).toBeInTheDocument();
    expect(screen.getByText('square')).toBeInTheDocument();
    expect(screen.getByText('circle')).toBeInTheDocument();
    expect(screen.getByText('ellipse')).toBeInTheDocument();
    expect(screen.getByText('sun')).toBeInTheDocument();
    expect(screen.getByText('moon')).toBeInTheDocument();
  });
});
