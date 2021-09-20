import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnsibleHostDetail from './';

describe('AnsibleHostDetail', () => {
  it('should show skeleton when loading', () => {
    const { container } = render(
      <AnsibleHostDetail
        status="PENDING"
        response={{ id: 5 }}
        router={{}}
        history={{}}
      />
    );
    expect(
      container.getElementsByClassName('react-loading-skeleton')
    ).toHaveLength(5);
  });
});
