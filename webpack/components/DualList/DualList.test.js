import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import DualList from './index';

const defaultProps = {
  availableOptions: ['role.a', 'role.b'],
  chosenOptions: ['role.c'],
  onListChange: jest.fn(),
};

describe('DualList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders available and chosen options', () => {
    render(<DualList {...defaultProps} />);

    expect(screen.getByText('Available Ansible roles')).toBeInTheDocument();
    expect(screen.getByText('Assigned Ansible roles')).toBeInTheDocument();
    expect(screen.getByText('role.a')).toBeInTheDocument();
    expect(screen.getByText('role.b')).toBeInTheDocument();
    expect(screen.getByText('role.c')).toBeInTheDocument();
  });

  it('moves selected available options to chosen', () => {
    render(<DualList {...defaultProps} />);

    fireEvent.click(screen.getByRole('option', { name: 'role.a' }));
    userEvent.click(screen.getByRole('button', { name: 'Add selected' }));

    expect(defaultProps.onListChange).toHaveBeenCalledWith(
      ['role.b'],
      ['role.c', 'role.a']
    );
  });

  it('moves selected chosen options to available', () => {
    render(<DualList {...defaultProps} />);

    fireEvent.click(screen.getByRole('option', { name: 'role.c' }));
    userEvent.click(screen.getByRole('button', { name: 'Remove selected' }));

    expect(defaultProps.onListChange).toHaveBeenCalledWith(
      ['role.a', 'role.b', 'role.c'],
      []
    );
  });

  it('moves all available options to chosen', () => {
    render(<DualList {...defaultProps} />);

    userEvent.click(screen.getByRole('button', { name: 'Add all' }));

    expect(defaultProps.onListChange).toHaveBeenCalledWith(
      [],
      ['role.c', 'role.a', 'role.b']
    );
  });

  it('moves all chosen options to available', () => {
    render(<DualList {...defaultProps} />);

    userEvent.click(screen.getByRole('button', { name: 'Remove all' }));

    expect(defaultProps.onListChange).toHaveBeenCalledWith(
      ['role.a', 'role.b', 'role.c'],
      []
    );
  });

  it('disables move controls when nothing is selected or lists are empty', () => {
    render(
      <DualList
        availableOptions={[]}
        chosenOptions={[]}
        onListChange={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Add selected' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Add all' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove all' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Remove selected' })
    ).toBeDisabled();
  });

  it('shows selection status for each pane', () => {
    render(<DualList {...defaultProps} />);

    fireEvent.click(screen.getByRole('option', { name: 'role.a' }));
    fireEvent.click(screen.getByRole('option', { name: 'role.c' }));

    expect(screen.getByText('1 of 2 items selected')).toBeInTheDocument();
    expect(screen.getByText('1 of 1 items selected')).toBeInTheDocument();
  });
});
