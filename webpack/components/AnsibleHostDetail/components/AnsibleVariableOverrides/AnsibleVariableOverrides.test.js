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
                name: 'test.role',
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
                      currentValue: null,
                    },
                    {
                      key: 'circle',
                      defaultValue: 'd',
                      parameterType: 'string',
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
                      currentValue: null,
                    },
                    {
                      key: 'sun',
                      defaultValue: "{ one: 'one', two: 'two' }",
                      parameterType: 'json',
                      currentValue: null,
                    },
                    {
                      key: 'moon',
                      defaultValue: [
                        { hosts: 'all', become: 'true', roles: ['foo'] },
                      ],
                      parameterType: 'yaml',
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

const hostAttrs = {
  operatingsystem_id: 6,
  hostgroup_id: 7,
  domain_id: 9,
};

const TestComponent = props => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <AnsibleVariableOverrides {...props} />
  </MockedProvider>
);

describe('AnsibleVariableOverrides', () => {
  it('should show skeleton when page is loading', () => {
    const { container } = render(
      <TestComponent status="PENDING" id={hostId} hostAttrs={hostAttrs} />
    );
    expect(
      container.getElementsByClassName('react-loading-skeleton')
    ).toHaveLength(5);
  });
  it('should load', async () => {
    const { container } = render(
      <MemoryRouter>
        <TestComponent status="RESOLVED" id={hostId} hostAttrs={hostAttrs} />
      </MemoryRouter>
    );
    expect(
      container.getElementsByClassName('react-loading-skeleton')
    ).toHaveLength(5);
    await waitFor(tick);
    expect(screen.getByText('rectangle')).toBeInTheDocument();
    expect(screen.getByText('square')).toBeInTheDocument();
    expect(screen.getByText('circle')).toBeInTheDocument();
    expect(screen.getByText('ellipse')).toBeInTheDocument();
    expect(screen.getByText('sun')).toBeInTheDocument();
    expect(screen.getByText('moon')).toBeInTheDocument();
    expect(
      screen.getByText('hostgroup: parent hostgroup').closest('a')
    ).not.toBeInTheDocument();
    expect(screen.getByText('os: CentOS 7.9').closest('a')).toHaveAttribute(
      'href',
      '/operatingsystems/6/edit'
    );
    expect(
      screen.getByText('domain: example.com').closest('a')
    ).toHaveAttribute('href', '/domains/9/edit');
  });
});
