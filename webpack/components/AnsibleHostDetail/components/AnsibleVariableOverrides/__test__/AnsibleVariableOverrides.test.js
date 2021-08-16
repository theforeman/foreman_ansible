import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnsibleVariableOverrides from '../';
import { mocks, hostId, hostAttrs } from './AnsibleVariableOverrides.fixtures';
import { withRedux, withMockedProvider, tick } from '../../../../../testHelper';

const TestComponent = withRedux(withMockedProvider(AnsibleVariableOverrides));

describe('AnsibleVariableOverrides', () => {
  it('should show skeleton when page is loading', () => {
    const { container } = render(
      <TestComponent showToast={jest.fn()} id={hostId} hostAttrs={{}} />
    );
    expect(
      container.getElementsByClassName('react-loading-skeleton')
    ).toHaveLength(5);
  });
  it('should load', async () => {
    render(
      <TestComponent
        showToast={jest.fn()}
        id={hostId}
        mocks={mocks}
        hostAttrs={hostAttrs}
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
});
