import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AnsibleRolesSwitcher from '../AnsibleRolesSwitcher';

jest.mock('foremanReact/components/Pagination/PaginationWrapper');

describe('AnsibleRolesSwitcher', () => {
  const noop = () => {};

  it('should render', async () => {
    const page = shallow(<AnsibleRolesSwitcher
      loading={false}
      pagination={{ page: 1, perPage: 12 }}
      itemCount={20}
      addAnsibleRole={noop}
      removeAnsibleRole={noop}
      getAnsibleRoles={noop}
      changeAssignedPage={noop}
      assignedPagination={{ page: 1, perPage: 12 }}
      assignedRolesCount={2}
      initialAssignedRoles={[]}
      assignedRoles={[]}
      unassignedRoles={[]}
      resourceName='host'
      error={{ statusText: '', errorMsg: '' }}
    />);

    expect(toJson(page)).toMatchSnapshot();
  });
});
