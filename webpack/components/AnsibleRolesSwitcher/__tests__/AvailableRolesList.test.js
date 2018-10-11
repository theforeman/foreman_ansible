import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AvailableRolesList from '../AvailableRolesList';

describe('AvailableRolesList', () => {
  const noop = () => {};

  it('should render', () => {
    const page = shallow(<AvailableRolesList
      unassignedRoles={[{ id: 1, name: 'fake.role' }, { id: 2, name: 'test.role' }]}
      pagination={{ page: 1, perPage: 25 }}
      itemCount={2}
      onListingChange={noop}
      onAddRole={noop}
      loading={false}
    />);

    expect(toJson(page)).toMatchSnapshot();
  });
});
