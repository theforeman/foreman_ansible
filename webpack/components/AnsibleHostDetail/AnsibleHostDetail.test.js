import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnsibleHostDetail from './';

describe('AnsibleHostDetail', () => {
  it('should show content', () => {
    render(<AnsibleHostDetail status="RESOLVED" response={{ id: 3 }} />);
    expect(
      screen.getByText('Ansible Variables coming soon!')
    ).toBeInTheDocument();
  });
});
