import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { AnsibleRolesImportButtonWrapper } from './AnsibleRolesImportButtonWrapper';
import * as toastHelper from '../../../toastHelper';

jest.mock('foremanReact/common/hooks/API/APIHooks', () => ({
  useAPI: jest.fn(),
}));
jest.spyOn(toastHelper, 'showToast');

describe('AnsibleRolesImportButtonWrapper', () => {
  it('should render the dropdown', () => {
    useAPI.mockImplementation(() => ({
      status: 'RESOLVED',
      response: { results: [{ name: 'import_ansible_roles' }] },
    }));

    const { queryByRole } = render(<AnsibleRolesImportButtonWrapper />);

    const dropdownButton = queryByRole('button', 'Import from');

    expect(dropdownButton).toBeInTheDocument();
  });

  it('should not render the dropdown if unpermitted', () => {
    useAPI.mockImplementation(() => ({
      status: 'RESOLVED',
      response: { results: [{ name: 'not_import_ansible_roles' }] },
    }));

    const { queryByRole } = render(<AnsibleRolesImportButtonWrapper />);

    const dropdownButton = queryByRole('button', 'Import from');

    expect(dropdownButton).not.toBeInTheDocument();
  });

  it('should toast on API error', async () => {
    useAPI.mockImplementation(() => ({
      status: 'ERROR',
      response: { results: [] },
    }));

    render(<AnsibleRolesImportButtonWrapper />);

    expect(toastHelper.showToast).toHaveBeenCalledTimes(1);
    expect(toastHelper.showToast).toHaveBeenCalledWith({
      message: 'There was an error requesting user permissions',
      type: 'error',
    });
  });
});
