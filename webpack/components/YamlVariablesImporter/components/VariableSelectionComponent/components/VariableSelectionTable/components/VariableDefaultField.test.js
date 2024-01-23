import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VariableDefaultField } from './VariableDefaultField';
import {
  testCopy,
  testVariableNode,
  variableDefaultFieldDropdownOptions,
} from '../../../../../testConstants';

describe('VariableDefaultField', () => {
  it('should render field', async () => {
    const { container } = render(
      <VariableDefaultField node={testVariableNode} />
    );

    const inputField = container.querySelector('input');
    const menuToggle = screen.getByTestId('VariableDefaultFieldToggle');

    await waitFor(() => {
      fireEvent.click(menuToggle);
    });

    const menuItems = container.getElementsByTagName('li');
    expect(menuItems).toHaveLength(variableDefaultFieldDropdownOptions.length);
    expect(inputField.value).toBe(JSON.stringify(testVariableNode.default));
  });
  it('should process inputs', async () => {
    const tempNode = testCopy(testVariableNode);

    const { container } = render(<VariableDefaultField node={tempNode} />);
    const inputField = container.querySelector('input');

    const newDefault = 'new_default_val';
    fireEvent.change(inputField, { target: { value: newDefault } });

    expect(inputField.value).toBe(newDefault);
    expect(tempNode.default).toBe(newDefault);
  });
});
