/* eslint-disable max-lines */
import variableOverridesQuery from '../../../../../graphql/queries/variableOverrides.gql';
import deleteAnsibleVariableOverride from '../../../../../graphql/mutations/deleteAnsibleVariableOverride.gql';
import updateAnsibleVariableOverride from '../../../../../graphql/mutations/updateAnsibleVariableOverride.gql';
import createAnsibleVariableOverride from '../../../../../graphql/mutations/createAnsibleVariableOverride.gql';

export const hostId = 3;
const hostGlobalId = 'MDE6SG9zdC0z';
const name = 'centos-random.example.com';
const match = `fqdn=${name}`;

export const hostAttrs = {
  name,
};

const overrideUpdateDeleteId = 'MDE6TG9va3VwVmFsdWUtODQ=';
const ansibleVariableId = 'MDE6QW5zaWJsZVZhcmlhYmxlLTY2';
const variableId = 66;

const barVariableGlobalId = 'MDE6QW5zaWJsZVZhcmlhYmxlLTU3Mw==';
const barVariableId = 573;

export const mocks = [
  {
    request: {
      query: variableOverridesQuery,
      variables: {
        id: hostGlobalId,
        hostId,
        match,
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
                ansibleVariablesWithOverrides: {
                  nodes: [
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: ansibleVariableId,
                      key: 'rectangle',
                      defaultValue: 17,
                      parameterType: 'integer',
                      ansibleRoleName: 'test.role',
                      validatorType: '',
                      validatorRule: null,
                      required: false,
                      lookupValues: {
                        nodes: [
                          {
                            __typename: 'LookupValue',
                            id: overrideUpdateDeleteId,
                            match,
                            value: 21,
                            omit: false,
                          },
                        ],
                      },
                      currentValue: {
                        __typename: 'AnsibleVariableOverride',
                        value: 21,
                        element: 'fqdn',
                        elementName: name,
                      },
                    },
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: barVariableGlobalId,
                      key: 'bar',
                      defaultValue: 'a',
                      parameterType: 'string',
                      ansibleRoleName: 'test.role',
                      validatorType: 'list',
                      validatorRule: 'a,b,c',
                      required: true,
                      lookupValues: {
                        nodes: [
                          {
                            __typename: 'LookupValue',
                            id: 'MDE6TG9va3VwVmFsdWUtODE=',
                            match,
                            value: 'b',
                            omit: false,
                          },
                        ],
                      },
                      currentValue: null,
                    },
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: 'MDE6QW5zaWJsZVZhcmlhYmxlLTY1',
                      key: 'square',
                      defaultValue: true,
                      parameterType: 'boolean',
                      ansibleRoleName: 'test.role',
                      validatorType: '',
                      validatorRule: null,
                      required: false,
                      lookupValues: {
                        nodes: [],
                      },
                      currentValue: null,
                    },
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: 'MDE6QW5zaWJsZVZhcmlhYmxlLTc4',
                      key: 'circle',
                      defaultValue: 'd',
                      parameterType: 'string',
                      ansibleRoleName: 'test.role',
                      validatorType: '',
                      validatorRule: null,
                      required: false,
                      lookupValues: {
                        nodes: [],
                      },
                      currentValue: {
                        __typename: 'AnsibleVariableOverride',
                        value: 'c',
                        element: 'domain',
                        elementName: 'example.com',
                      },
                    },
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: 'MDE6QW5zaWJsZVZhcmlhYmxlLTc5',
                      key: 'ellipse',
                      defaultValue: ['seven', 'eight'],
                      parameterType: 'array',
                      ansibleRoleName: 'test.role',
                      validatorType: '',
                      validatorRule: null,
                      required: false,
                      lookupValues: {
                        nodes: [],
                      },
                      currentValue: {
                        __typename: 'AnsibleVariableOverride',
                        value: ['nine'],
                        element: 'hostgroup',
                        elementName: 'parent hostgroup',
                      },
                    },
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: 'MDE6QW5zaWJsZVZhcmlhYmxlLTY2Ng==',
                      key: 'spiral',
                      defaultValue: { one: 'one', two: 'two' },
                      parameterType: 'hash',
                      ansibleRoleName: 'test.role',
                      validatorType: '',
                      validatorRule: null,
                      required: false,
                      lookupValues: {
                        nodes: [],
                      },
                      currentValue: null,
                    },
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: 'MDE6QW5zaWJsZVZhcmlhYmxlLTY3Mg==',
                      key: 'sun',
                      defaultValue: "{ one: 'one', two: 'two' }",
                      parameterType: 'json',
                      ansibleRoleName: 'test.role',
                      validatorType: '',
                      validatorRule: null,
                      required: false,
                      lookupValues: {
                        nodes: [],
                      },
                      currentValue: null,
                    },
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: 'MDE6QW5zaWJsZVZhcmlhYmxlLTY3Mw==',
                      key: 'moon',
                      defaultValue: [
                        { hosts: 'all', become: 'true', roles: ['foo'] },
                      ],
                      parameterType: 'yaml',
                      ansibleRoleName: 'test.role',
                      validatorType: '',
                      validatorRule: null,
                      required: false,
                      lookupValues: {
                        nodes: [],
                      },
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

export const deleteMocks = [
  {
    request: {
      query: deleteAnsibleVariableOverride,
      variables: { id: overrideUpdateDeleteId, hostId, variableId },
    },
    result: {
      data: {
        deleteAnsibleVariableOverride: {
          errors: [],
          id: overrideUpdateDeleteId,
          overridenAnsibleVariable: {
            __typename: 'OverridenAnsibleVariable',
            id: ansibleVariableId,
            currentValue: {
              __typename: 'AnsibleVariableOverride',
              element: 'os',
              elementName: 'CentOS 7.8',
              value: 101,
            },
          },
        },
      },
    },
  },
];

const updateMockFactory = (variableValue, returnValue, errors = []) => {
  const mockArray = [
    {
      request: {
        query: updateAnsibleVariableOverride,
        variables: {
          id: overrideUpdateDeleteId,
          hostId,
          ansibleVariableId: variableId,
          value: variableValue,
          match: `fqdn=${hostAttrs.name}`,
        },
      },
      result: {
        data: {
          updateAnsibleVariableOverride: {
            overridenAnsibleVariable: {
              __typename: 'OverridenAnsibleVariable',
              id: ansibleVariableId,
              lookupValues: {
                nodes: [
                  {
                    id: 'MDE6TG9va3VwVmFsdWUtOTY=',
                    match: 'fqdn=centos-random.example.com',
                    value: returnValue,
                    omit: false,
                  },
                ],
              },
              currentValue: {
                __typename: 'AnsibleVariableOverride',
                element: 'fqdn',
                elementName: 'centos-random.example.com',
                value: returnValue,
              },
            },
            errors,
          },
        },
      },
    },
  ];

  return mockArray;
};

const createMockFactory = (variableValue, returnValue, errors = []) => {
  const variables = {
    hostId,
    lookupKeyId: barVariableId,
    value: variableValue,
    match: `fqdn=${hostAttrs.name}`,
  };

  const mockArray = [
    {
      request: {
        query: createAnsibleVariableOverride,
        variables,
      },
      result: {
        data: {
          createAnsibleVariableOverride: {
            overridenAnsibleVariable: {
              __typename: 'OverridenAnsibleVariable',
              id: ansibleVariableId,
              lookupValues: {
                nodes: [
                  {
                    __typename: 'LookupValue',
                    id: 'MDE6TG9va3VwVmFsdWUtOTY=',
                    match: 'fqdn=centos-random.example.com',
                    value: returnValue,
                    omit: false,
                  },
                ],
              },
              currentValue: {
                __typename: 'AnsibleVariableOverride',
                element: 'fqdn',
                elementName: 'centos-random.example.com',
                value: returnValue,
              },
            },
            errors,
          },
        },
      },
    },
  ];

  return mockArray;
};

export const updateMocks = updateMockFactory('2177', 2177);
export const createMocks = createMockFactory('b', 'b');
export const updateErrorMocks = updateMockFactory('2177', 21, [
  {
    path: ['base'],
    message: 'Not enough minerals',
    __typename: 'AttributeError',
  },
]);

export const updateValidationMocks = updateMockFactory('foo', 21, [
  {
    path: ['attributes', 'value'],
    message: 'is invalid integer',
    __typename: 'AttributeError',
  },
]);
