import React from 'react';
import '@testing-library/jest-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent, waitFor } from '@testing-library/react';

import { testCopy, testVariableNode } from '../../../../../testConstants';
import { VariableNameField } from './VariableNameField';
import * as helpers from '../../../../../YamlVariablesImporterHelpers';
import { DuplicateStatus } from '../../../../../YamlVariablesImporterConstants';

describe('VariableNameField', () => {
  it('should render the default field', async () => {
    const { container } = render(<VariableNameField />);

    const inputField = container.querySelector('input');

    expect(inputField.value).toBe('');
  });
  it('should process inputs', async () => {
    jest.spyOn(helpers, 'duplicatesInstalled').mockImplementation(() => false);
    jest.spyOn(helpers, 'duplicatesLocal').mockImplementation(() => []);

    const tempNode = testCopy(testVariableNode);

    const { container } = render(<VariableNameField node={tempNode} />);
    const inputField = container.querySelector('input');

    const newName = 'new_var_name';
    await waitFor(() => {
      fireEvent.change(inputField, { target: { value: newName } });
    });

    expect(inputField.value).toBe(newName);
    expect(tempNode.name).toBe(newName);
  });

  it('should alert on conflicting inputs', async () => {
    const tempNode = testCopy(testVariableNode);
    tempNode.isDuplicate = DuplicateStatus.INSTALLED_DUPLICATE;

    const { container } = render(<VariableNameField node={tempNode} />);
    const helperTextField = container.querySelector(
      '.pf-c-helper-text__item-text'
    );
    const inputField = container.querySelector('input');

    const newName1 = 'new_var_name_1';
    const newName2 = 'new_var_name_2';
    const newName3 = 'new_var_name_3';

    jest.spyOn(helpers, 'duplicatesInstalled').mockImplementation(() => false);
    jest
      .spyOn(helpers, 'duplicatesLocal')
      .mockImplementation(() => [tempNode, tempNode]);

    await waitFor(() => {
      fireEvent.change(inputField, { target: { value: newName1 } });
    });

    expect(helperTextField).toHaveTextContent(`Variable names must be unique`);
    expect(tempNode.isDuplicate).toBe(DuplicateStatus.LOCAL_DUPLICATE);

    jest.spyOn(helpers, 'duplicatesInstalled').mockImplementation(() => true);
    jest.spyOn(helpers, 'duplicatesLocal').mockImplementation(() => []);

    await waitFor(() => {
      fireEvent.change(inputField, { target: { value: newName2 } });
    });
    expect(helperTextField).toHaveTextContent(
      `Variable "${newName2}" already exists. It will be overridden!`
    );
    expect(tempNode.isDuplicate).toBe(DuplicateStatus.INSTALLED_DUPLICATE);

    jest.spyOn(helpers, 'duplicatesInstalled').mockImplementation(() => false);
    jest.spyOn(helpers, 'duplicatesLocal').mockImplementation(() => []);

    await waitFor(() => {
      fireEvent.change(inputField, { target: { value: newName3 } });
    });
    expect(tempNode.isDuplicate).toBe(DuplicateStatus.NO_DUPLICATE);
  });
});
