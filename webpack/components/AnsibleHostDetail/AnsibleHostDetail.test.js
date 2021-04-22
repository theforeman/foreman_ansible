import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnsibleHostDetail from './';

describe('AnsibleHostDetail', () => {
  it('should show content', () => {
    render(<AnsibleHostDetail />);
    expect(
      screen.getByText('Ansible Variables coming soon!')
    ).toBeInTheDocument();
  });
});
