import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnsibleVariableOverrides from '../';
import { mocks, hostId, hostAttrs } from './AnsibleVariableOverrides.fixtures';
import { withMockedProvider, withRedux, tick } from '../../../../../testHelper';

const TestComponent = withRedux(withMockedProvider(AnsibleVariableOverrides));

describe('AnsibleVariableOverrides', () => {
  it('should show skeleton when page is loading', () => {
    const { container } = render(
      <TestComponent
        hostId={hostId}
        hostAttrs={hostAttrs}
        mocks={mocks}
        hostName="test.example.com"
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
        hostName="test.example.com"
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
