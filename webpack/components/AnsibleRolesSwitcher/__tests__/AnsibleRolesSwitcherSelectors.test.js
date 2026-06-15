import {
  selectToDestroyRoles,
  selectUnassignedRoles,
} from '../AnsibleRolesSwitcherSelectors';
import { ansibleRolesShort } from '../__fixtures__/ansibleRolesData.fixtures';

const stateFactory = obj => ({
  foremanAnsible: {
    ansibleRolesSwitcher: obj,
  },
});

describe('AnsibleRolesSwitcherSelectors', () => {
  it('returns unassigned roles', () => {
    const state = stateFactory({
      results: ansibleRolesShort,
      assignedRoles: [{ id: 2 }, { id: 4 }],
      inheritedRoleIds: [],
    });

    expect(selectUnassignedRoles(state)).toEqual([
      ansibleRolesShort[0],
      ansibleRolesShort[2],
    ]);
  });

  it('returns all roles when none are assigned', () => {
    const state = stateFactory({
      results: ansibleRolesShort,
      assignedRoles: [],
      inheritedRoleIds: [],
    });

    expect(selectUnassignedRoles(state)).toEqual(ansibleRolesShort);
  });

  it('camelCases roles marked for destruction', () => {
    const state = stateFactory({
      toDestroyRoles: [
        {
          id: 2,
          name: 'jtyr.ntp',
          host_ansible_role_id: 9,
          destroy: true,
        },
      ],
    });

    expect(selectToDestroyRoles(state)).toEqual([
      {
        id: 2,
        name: 'jtyr.ntp',
        hostAnsibleRoleId: 9,
        destroy: true,
      },
    ]);
  });
});
