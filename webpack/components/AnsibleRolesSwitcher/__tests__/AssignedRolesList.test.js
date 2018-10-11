import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AssignedRolesList from '../AssignedRolesList';

describe('AssignedRolesList', () => {
  const noop = () => {};

  it('should render', () => {
    const page = shallow(<AssignedRolesList
      assignedRoles={[{ id: 1, name: 'fake.role' }, { id: 2, name: 'test.role' }]}
      pagination={{ page: 1, perPage: 25 }}
      itemCount={2}
      onPaginationChange={noop}
      onRemoveRole={noop}
      resourceName='host'
    />);

    expect(toJson(page)).toMatchSnapshot();
  });
});
