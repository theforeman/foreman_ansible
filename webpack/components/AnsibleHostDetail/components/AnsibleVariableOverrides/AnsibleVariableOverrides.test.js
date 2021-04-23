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
                      },
                    },
                    {
                      key: 'wheel',
                      defaultValue: {one: "one", two: "two", three: "three"},
                      parameterType: 'hash',
                      currentValue: null
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
  it('should show spinner when page is loading', () => {
    render(<TestComponent status="PENDING" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
  it('should load', async () => {
    render(
      <MemoryRouter>
        <TestComponent status="RESOLVED" id={hostId} hostAttrs={hostAttrs} />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
    await waitFor(tick);
    expect(screen.getByText('rectangle')).toBeInTheDocument();
    expect(screen.getByText('square')).toBeInTheDocument();
    expect(screen.getByText('circle')).toBeInTheDocument();
    expect(screen.getByText('ellipse')).toBeInTheDocument();
  });
});
