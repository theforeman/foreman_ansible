import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { VariableSelectionSubMenu } from '../../VariableSelectionSubMenu';

describe('VariableSelectionSecondaryRow', () => {
  it('should render the secondary row', () => {
    const { container } = render(<VariableSelectionSubMenu />);
    expect(container).toBeInTheDocument();
  });
});
