import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AnsibleRole from '../AnsibleRole';

describe('AnsibleRole', () => {
  const noop = () => {};
  it('should render a role to add', () => {
    const page = shallow(<AnsibleRole
        role={{ name: 'test.role', id: 5 }}
        icon='fa fa-plus-circle'
        onClick={noop}
      />);

    expect(toJson(page)).toMatchSnapshot();
  });

  it('should render a role to remove', () => {
    const page = shallow(<AnsibleRole
        role={{ name: 'test.role', id: 5 }}
        icon='fa fa-minus-circle'
        onClick={noop}
      />);

    expect(toJson(page)).toMatchSnapshot();
  });

  it('should render inherited role to remove', () => {
    const page = shallow(<AnsibleRole
        role={{ name: 'test.role', id: 5, inherited: true }}
        icon='fa fa-minus-circle'
        onClick={noop}
      />);

    expect(toJson(page)).toMatchSnapshot();
  });
});
