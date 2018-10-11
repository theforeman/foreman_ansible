import { calculateUnassignedRoles, assignedRolesPage } from '../AnsibleRolesSwitcherSelectors';

import { ansibleRolesShort, AnsibleRolesLong } from '../__fixtures__/ansibleRolesData.fixtures';

describe('calculateUnassignedRoles', () => {
  it('should return unassigned roles', () => {
    const assignedRoles = [
      { id: 2 },
      { id: 4 },
    ];

    expect(() => {
      calculateUnassignedRoles({ ansibleRolesShort, assignedRoles }).toEqual([
        { id: 1, name: 'sthirugn.motd' },
        { id: 3, name: 'rvm.ruby' },
      ]);
    });
  });

  it('should return all roles when no roles assigned', () => {
    expect(() => {
      calculateUnassignedRoles({ results: ansibleRolesShort, assignedRoles: [] })
        .toEqual(ansibleRolesShort);
    });
  });
});

describe('assignedRolesPage', () => {
  it('should return requested page', () => {
    expect(() => {
      assignedRolesPage(AnsibleRolesLong, { page: 2, perPage: 5 })
        .toEqual(AnsibleRolesLong.slice(5, 10));
    });
  });
});
