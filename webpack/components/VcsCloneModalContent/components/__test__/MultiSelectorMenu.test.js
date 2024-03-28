import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MultiSelectorMenu } from '../MultiSelectorMenu';

const repoInfo = {
  head: {
    ref: 'HEAD',
    sha: '4d4f55f7988728c46f47022e2e354405ba41ff83',
  },
  branches: {
    '98-verify-checksums': {
      ref: 'refs',
      sha: 'de1378b11a514fd21e4b1ca6528d97937bfbe911',
    },
    master: {
      ref: 'refs',
      sha: '4d4f55f7988728c46f47022e2e354405ba41ff83',
    },
  },
  tags: {
    '1.0.0': {
      ref: 'refs',
      sha: 'e4c795e6d037ebc590224243d8cec54423f015cd',
    },
    '1.0.0^{}': {
      ref: 'refs',
      sha: '9408a6ce1f718c3f0c459887b7bc5bc9c2fc3829',
    },
    '1.0.1': {
      ref: 'refs',
      sha: '03ce696243a45742da4b72259ad1faf7a6ce8a80',
    },
  },
  vcs_url: 'https://github.com/DavidWittman/ansible-redis.git',
};

describe('MultiSelectorMenu', () => {
  it('tests the default component', () => {
    const { container } = render(<MultiSelectorMenu />);

    expect(container).toBeInTheDocument();
  });

  it('tests the adding of items', () => {
    const { container } = render(<MultiSelectorMenu repoInfo={repoInfo} />);

    const menuContent = screen.getByTestId('MultiSelectorMenuMenuContent');

    expect(container).toBeInTheDocument();
    expect(menuContent.children).toHaveLength(2);
  });

  it('tests the selection of items', () => {
    // eslint-disable-next-line no-unused-vars
    for (const toTest of ['branches', 'tags']) {
      const setState = jest.fn();

      const { container } = render(
        <MultiSelectorMenu
          repoInfo={repoInfo}
          displayData={toTest}
          setGitRef={setState}
        />
      );

      const menuContent = screen.getByTestId('MultiSelectorMenuMenuContent');
      const menuItems = menuContent.children;

      const items = Object.keys(repoInfo[toTest]);

      expect(container).toBeInTheDocument();
      for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        const button = item.querySelector('button');

        fireEvent.click(button);
        expect(setState).toBeCalledWith(items[i]);
      }
      expect(setState).toBeCalledTimes(items.length);
      cleanup();
    }
  });
});
