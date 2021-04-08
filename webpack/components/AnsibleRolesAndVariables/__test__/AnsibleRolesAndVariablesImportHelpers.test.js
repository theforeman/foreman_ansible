import { prepareResult } from '../AnsibleRolesAndVariablesHelpers';

const bennojoy = { created_at: null, id: null, name: 'bennojoy.ntp' };
const gitRole = { created_at: null, id: null, name: '0ta2.git_role' };
const jriguera = { created_at: null, id: null, name: 'jriguera.monit' };
const rows = [
  {
    cells: [
      'bennojoy.ntp',
      'Update Role Variables',
      'Add: 1 Remove: 2 ',
      '',
      '',
    ],
    kind: 'old',
    id: 'bennojoy.ntp',
    role: bennojoy,
    selected: true,
  },
  {
    cells: ['0ta2.git_role', 'Import Role ', 'Add: 5 ', '', ''],
    kind: 'new',
    id: '0ta2.git_role',
    role: gitRole,
    selected: true,
  },
  {
    cells: ['jriguera.monit', 'Import Role ', 'Add: 12 ', '', ''],
    kind: 'new',
    id: 'jriguera.monit',
    role: jriguera,
  },
];

const result = {
  old: {
    'bennojoy.ntp': bennojoy,
  },
  new: {
    '0ta2.git_role': gitRole,
  },
};

describe('AnsibleRolesAndVariablesHelpers', () => {
  describe('prepareResult', () => {
    it('should return correct results', () => {
      expect(prepareResult(rows)).toStrictEqual(result);
    });
  });
});
