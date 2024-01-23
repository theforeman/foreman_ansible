import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';

import { RoleSelectionDropdown } from './RoleSelectionDropdown';

describe('RoleSelectionDropdown', () => {
  it('should render the default component', async () => {
    const { container } = render(<RoleSelectionDropdown />);

    expect(container).toBeInTheDocument();
  });
});
