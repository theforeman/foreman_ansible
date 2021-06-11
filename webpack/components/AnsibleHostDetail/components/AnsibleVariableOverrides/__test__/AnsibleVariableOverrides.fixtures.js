import variableOverridesQuery from '../../../../../graphql/queries/variableOverrides.gql';
import deleteAnsibleVariableOverride from '../../../../../graphql/mutations/deleteAnsibleVariableOverride.gql';

export const hostId = 3;
const hostGlobalId = 'MDE6SG9zdC0z';

export const hostAttrs = {
  name: 'centos-random.example.com',
};

const overrideDeleteId = 'MDE6TG9va3VwVmFsdWUtODQ=';
const ansibleVariableId = 'MDE6QW5zaWJsZVZhcmlhYmxlLTY2';
const variableId = 66;

export const mocks = [
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
                ansibleVariablesWithOverrides: {
                  nodes: [
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: ansibleVariableId,
                      key: 'rectangle',
                      defaultValue: 17,
                      parameterType: 'integer',
                      ansibleRoleName: 'test.role',
                      lookupValues: {
                        nodes: [
                          {
                            __typename: 'LookupValue',
                            id: 'MDE6TG9va3VwVmFsdWUtMzE=',
                            match: 'hostgroup=fail hostgroup',
                            value: null,
                            omit: true,
                          },
                          {
                            __typename: 'LookupValue',
                            id: 'MDE6TG9va3VwVmFsdWUtMzQ=',
                            match: 'fqdn=moses-reavis.example.com',
                            value: 30,
                            omit: false,
                          },
                          {
                            __typename: 'LookupValue',
                            id: 'MDE6TG9va3VwVmFsdWUtNDE=',
                            match: 'os=CentOS 7.8',
                            value: 101,
                            omit: false,
                          },
                          {
                            __typename: 'LookupValue',
                            id: 'MDE6TG9va3VwVmFsdWUtNDI=',
                            match: 'hostgroup=parent',
                            value: 99,
                            omit: false,
                          },
                          {
                            __typename: 'LookupValue',
                            id: overrideDeleteId,
                            match: 'fqdn=centos-random.example.com',
                            value: 21,
                            omit: false,
                          },
                        ],
                      },
                      currentValue: {
                        __typename: 'AnsibleVariableOverride',
                        value: 21,
                        element: 'fqdn',
                        elementName: 'centos-random.example.com',
                      },
                    },
                    {
                      __typename: 'OverridenAnsibleVariable',
                      id: 'MDE6QW5zaWJsZVZhcmlhYmxlLTY1',
                      key: 'square',
                      defaultValue: true,
                      parameterType: 'boolean',
                      ansibleRoleName: 'test.role',
                      lookupValues: {
                        nodes: [
                          {
                            __typename: 'LookupValue',
                            id: 'MDE6TG9va3VwVmFsdWUtMjY=',
                            match: 'hostgroup=fail hostgroup',
                            value: true,
                            omit: false,
                          },
                          {
                            __typename: 'LookupValue',
                            id: 'MDE6TG9va3VwVmFsdWUtODM=',
                            match: 'fqdn=centos-random.example.com',
                            value: false,
                            omit: false,
                          },
                        ],
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
      variables: { id: overrideDeleteId, hostId, variableId },
    },
    result: {
      data: {
        deleteAnsibleVariableOverride: {
          errors: [],
          id: overrideDeleteId,
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
