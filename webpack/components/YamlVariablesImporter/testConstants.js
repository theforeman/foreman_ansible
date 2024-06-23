import { DuplicateStatus } from './YamlVariablesImporterConstants';

export const convertedFile0 = {
  role_0_var_0: {
    value: 'r0v0_val',
    type: 'string',
  },
  role_0_var_1: {
    value: 'r0v1_val',
    type: 'string',
  },
};
export const convertedFile1 = {
  role_1_var_0: {
    value: 'r1v0_val',
    type: 'string',
  },
  role_1_var_1: {
    value: 'r1v1_val',
    type: 'string',
  },
};

export const convertedFile0hash = 'hash0';
export const convertedFile1hash = 'hash1';

export const testNoSelectionTree = [
  {
    internal_id: 0,
    hash: convertedFile0hash,
    assign_to: 'role_0',
    count: 2,
    variables: [
      {
        name: 'role_0_var_0',
        checked: false,
        default: 'r0v0_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
      {
        name: 'role_0_var_1',
        checked: false,
        default: 'r0v1_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
    ],
  },
  {
    internal_id: 1,
    hash: convertedFile1hash,
    assign_to: 'role_1',
    count: 2,
    variables: [
      {
        name: 'role_1_var_0',
        checked: false,
        default: 'r1v0_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
      {
        name: 'role_1_var_1',
        checked: false,
        default: 'r1v1_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
    ],
  },
];

export const testAllSelectionTree = [
  {
    internal_id: 0,
    hash: convertedFile0hash,
    assign_to: 'role_0',
    count: 2,
    variables: [
      {
        name: 'role_0_var_0',
        checked: true,
        default: 'r0v0_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
      {
        name: 'role_0_var_1',
        checked: true,
        default: 'r0v1_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
    ],
  },
  {
    internal_id: 1,
    hash: convertedFile1hash,
    assign_to: 'role_1',
    count: 2,
    variables: [
      {
        name: 'role_1_var_0',
        checked: true,
        default: 'r1v0_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
      {
        name: 'role_1_var_1',
        checked: true,
        default: 'r1v1_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
    ],
  },
];

export const testSelectionTree = [
  {
    internal_id: 0,
    hash: convertedFile0hash,
    assign_to: 'role_0',
    count: 2,
    variables: [
      {
        name: 'role_0_var_0',
        checked: true,
        default: 'r0v0_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
      {
        name: 'role_0_var_1',
        checked: false,
        default: 'r0v1_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
    ],
  },
  {
    internal_id: 1,
    hash: convertedFile1hash,
    assign_to: 'role_1',
    count: 2,
    variables: [
      {
        name: 'role_1_var_0',
        checked: false,
        default: 'r1v0_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
      {
        name: 'role_1_var_1',
        checked: true,
        default: 'r1v1_val',
        isDuplicate: DuplicateStatus.NO_DUPLICATE,
        type: 'string',
      },
    ],
  },
];

export const testSelectionTreeEvaluated = {
  role_0: {
    role_0_var_0: {
      type: 'string',
      value: 'r0v0_val',
    },
  },
  role_1: {
    role_1_var_1: {
      type: 'string',
      value: 'r1v1_val',
    },
  },
};

export const testFileNode = testNoSelectionTree[0];

export const testVariableNode = testNoSelectionTree[0].variables[0];

export const testInstalledRoles = [
  'role_0',
  'role_1',
  'role_2',
  'role_3',
  'role_4',
];
export const testDefaultRole = 'role_2';

export const variableDefaultFieldDropdownOptions = [
  'auto',
  'string',
  'boolean',
  'integer',
  'real',
  'array',
  'hash',
  'yaml',
  'json',
];

export const testCopy = original => JSON.parse(JSON.stringify(original));
