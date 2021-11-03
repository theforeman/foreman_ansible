import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnsibleVariableOverrides from '../';
import {
  mocks,
  unauthorizedMocks,
  hostId,
  hostAttrs,
} from './AnsibleVariableOverrides.fixtures';
import {
  withMockedProvider,
  withRedux,
  tick,
  historyMock,
} from '../../../../../testHelper';

const TestComponent = withRedux(withMockedProvider(AnsibleVariableOverrides));

describe('AnsibleVariableOverrides', () => {
  it('should show skeleton when page is loading', () => {
    const { container } = render(
      <TestComponent
        hostId={hostId}
        hostAttrs={hostAttrs}
        mocks={mocks}
        history={historyMock}
      />
    );
    expect(
      container.getElementsByClassName('react-loading-skeleton')
    ).toHaveLength(5);
  });
  it('should load', async () => {
    render(
      <TestComponent
        hostId={hostId}
        mocks={mocks}
        hostAttrs={hostAttrs}
        history={historyMock}
      />
    );
    await waitFor(tick);
    expect(screen.getByText('rectangle')).toBeInTheDocument();
    expect(screen.getByText('square')).toBeInTheDocument();
    expect(screen.getByText('circle')).toBeInTheDocument();
    expect(screen.getByText('ellipse')).toBeInTheDocument();
    expect(screen.getByText('sun')).toBeInTheDocument();
    expect(screen.getByText('moon')).toBeInTheDocument();
  });
  it('should not allow editing when user does not have permissions', async () => {
    render(
      <TestComponent
        hostId={hostId}
        mocks={unauthorizedMocks}
        hostAttrs={hostAttrs}
        history={historyMock}
      />
    );
    await waitFor(tick);
    expect(screen.getByText('rectangle')).toBeInTheDocument();
    expect(screen.getByText('circle')).toBeInTheDocument();
    const editBtns = screen.queryAllByRole('button', {
      name: 'Edit override button',
    });
    expect(editBtns).toHaveLength(0);
    const actions = screen.queryAllByRole('button', { name: 'Actions' });
    expect(actions).toHaveLength(0);
  });
});
