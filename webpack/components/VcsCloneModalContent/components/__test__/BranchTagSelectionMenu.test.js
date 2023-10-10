import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BranchTagSelectionMenu } from '../BranchTagSelectionMenu';

describe('BranchTagSelectionMenu', () => {
  it('tests the default component', () => {
    const { container } = render(<BranchTagSelectionMenu />);

    expect(container).toBeInTheDocument();
  });

  it('test whether branches/tags tabs are enabled', () => {
    const { container } = render(<BranchTagSelectionMenu branchTagsEnabled />);
    const branchTab = screen
      .getByTestId('BranchTagSelectionMenuBranchTab')
      .closest('li');
    const tagTab = screen
      .getByTestId('BranchTagSelectionMenuTagTab')
      .closest('li');
    const manualTab = screen
      .getByTestId('BranchTagSelectionMenuManualTab')
      .closest('li');

    expect(container).toBeInTheDocument();

    expect(branchTab).not.toHaveClass('pf-m-disabled');
    expect(tagTab).not.toHaveClass('pf-m-disabled');
    expect(manualTab).not.toHaveClass('pf-m-disabled');
  });

  it('test whether branches/tags tabs are disabled', () => {
    const { container } = render(<BranchTagSelectionMenu />);

    const branchTab = screen
      .getByTestId('BranchTagSelectionMenuBranchTab')
      .closest('li');
    const tagTab = screen
      .getByTestId('BranchTagSelectionMenuTagTab')
      .closest('li');
    const manualTab = screen
      .getByTestId('BranchTagSelectionMenuManualTab')
      .closest('li');

    expect(container).toBeInTheDocument();

    expect(branchTab).toHaveClass('pf-m-disabled');
    expect(tagTab).toHaveClass('pf-m-disabled');
    expect(manualTab).not.toHaveClass('pf-m-disabled');
  });

  it('test whether tab selection works', () => {
    const { container } = render(<BranchTagSelectionMenu branchTagsEnabled />);

    // [bts_button ^ tab_list_item] ^ tab_list
    const tabs = screen
      .getByTestId('BranchTagSelectionMenuBranchTab')
      .closest('li')
      .closest('ul').children;

    expect(container).toBeInTheDocument();

    for (let i = 0; i < tabs.length; i++) {
      const currentTab = tabs[i];
      const nestedButton = currentTab.querySelector('button');

      fireEvent.click(nestedButton);

      expect(currentTab).toHaveClass('pf-m-current');
    }
  });
});
