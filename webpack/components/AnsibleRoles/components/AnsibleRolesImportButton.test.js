import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { AnsibleRolesImportButton } from './AnsibleRolesImportButton';
import * as toastHelper from '../../../toastHelper';
import { testSmartProxies } from './AnsibleRolesImportButton.fixtures';

jest.mock('foremanReact/common/hooks/API/APIHooks', () => ({
  useAPI: jest.fn(),
}));

jest.spyOn(toastHelper, 'showToast');

describe('AnsibleRolesImportButton', () => {
  it('should load', async () => {
    useAPI.mockImplementation(() => ({
      status: 'PENDING',
      response: { results: [] },
    }));

    const { queryByText, queryByRole } = render(<AnsibleRolesImportButton />);

    const dropdownButton = queryByRole('button', 'Import from');
    await dropdownButton.click();
    const loadingElement = queryByText('Loading...');

    expect(loadingElement).toBeInTheDocument();
  });

  it('should list Smart Proxies', async () => {
    useAPI.mockImplementation(() => ({
      status: 'RESOLVED',
      response: { results: testSmartProxies },
    }));

    const { queryByRole } = render(<AnsibleRolesImportButton />);

    const dropdownButton = queryByRole('button', 'Import from');
    await dropdownButton.click();
    const proxyList = queryByRole('menu');

    expect(proxyList.querySelectorAll('li')).toHaveLength(
      testSmartProxies.length
    );
  });

  it('should indicate that no supported Smart Proxies exist', async () => {
    useAPI.mockImplementation(() => ({
      status: 'RESOLVED',
      response: { results: [] },
    }));

    const { queryByText, queryByRole } = render(<AnsibleRolesImportButton />);

    const dropdownButton = queryByRole('button', 'Import from');
    await dropdownButton.click();
    const loadingElement = queryByText('No Smart Proxies found');

    expect(loadingElement).toBeInTheDocument();
  });

  it('should toast on API error', async () => {
    useAPI.mockImplementation(() => ({
      status: 'ERROR',
      response: { results: [] },
    }));

    render(<AnsibleRolesImportButton />);

    expect(toastHelper.showToast).toHaveBeenCalledTimes(1);
    expect(toastHelper.showToast).toHaveBeenCalledWith({
      message: 'There was an error requesting Smart Proxies',
      type: 'error',
    });
  });
});
