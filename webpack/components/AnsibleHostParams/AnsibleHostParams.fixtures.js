export const rectangleLookupKey = {
  parameter: 'rectangle',
  id: 66,
  override: true,
  description: 'Rectangle param',
  parameterType: 'integer',
  omit: null,
  defaultValue: 17,
  hiddenValue: false,
  currentOverride: {
    value: null,
    element: 'hostgroup',
    elementName: 'first hostgroup',
  },
  overrideValues: [
    {
      id: 31,
      match: 'hostgroup=first hostgroup',
      omit: true,
      value: null,
    },
  ],
};

export const squareLookupKey = {
  parameter: 'square',
  id: 65,
  override: true,
  description: 'Square param',
  parameterType: 'boolean',
  omit: null,
  defaultValue: true,
  hiddenValue: false,
  currentOverride: {
    value: false,
    element: 'hostgroup',
    elementName: 'first hostgroup',
  },
  overrideValues: [
    {
      id: 26,
      match: 'hostgroup=first hostgroup',
      omit: false,
      value: false,
    },
  ],
};

export const squareLookupValue = {
  defaultValue: true,
  element: 'hostgroup',
  elementName: 'first hostgroup',
  id: 26,
  omit: false,
  overriden: true,
  value: false,
};

export const ellipseLookupKey = {
  currentOverride: null,
  defaultValue: false,
  description: '',
  hiddenValue: true,
  id: 79,
  omit: null,
  override: true,
  overrideValues: [],
  parameter: 'ellipse',
  parameterType: 'boolean',
  required: false,
  validatorRule: null,
  validatorType: '',
};

export const ellipseLookupValue = {
  defaultValue: false,
  element: 'fqdn',
  omit: false,
  overriden: false,
  value: false,
};

export const triangleLookupKey = {
  parameter: 'triangle',
  id: 99,
  override: true,
  description: 'Triangle param',
  parameterType: 'integer',
  omit: null,
  defaultValue: 19,
  hiddenValue: false,
  currentOverride: {
    value: 1,
    element: 'hostgroup',
    elementName: 'first hostgroup',
  },
  overrideValues: [
    {
      id: 30,
      match: 'os=CentOS 7',
      omit: false,
      value: 7,
    },
    {
      id: 35,
      match: 'hostgroup=second hostgroup',
      omit: false,
      value: 9,
    },
    {
      id: 31,
      match: 'hostgroup=first hostgroup',
      omit: false,
      value: 8,
    },
    {
      id: 36,
      match: 'hostgroup=third hostgroup',
      omit: false,
      value: 3,
    },
    {
      id: 30,
      match: 'domain=example.com',
      omit: false,
      value: 89,
    },
  ],
};

export const roles = [
  {
    id: 3,
    name: 'aardvark.cube',
    ansibleVariables: [rectangleLookupKey, squareLookupKey],
  },
];
