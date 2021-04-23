import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnsibleHostDetail from './';

describe('AnsibleHostDetail', () => {
  it('should show spinner when loading', () => {
    render(<AnsibleHostDetail status="PENDING" response={{}} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
