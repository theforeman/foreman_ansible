import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GitLinkInputComponent } from '../GitLinkInputComponent';

describe('GitLinkInputComponent', () => {
  it('tests the default component', () => {
    const { container } = render(<GitLinkInputComponent />);

    const textInput = screen.getByTestId('GitLinkInputComponentTextInput');
    const examineButton = screen.getByText('Load metadata');

    expect(container).toBeInTheDocument();
    expect(textInput).toHaveValue('');

    expect(examineButton).toBeDisabled();
  });

  it('tests an accepted input value', () => {
    const { container } = render(
      <GitLinkInputComponent smartProxySelection={['proxy1']} />
    );
    const textInput = screen.getByTestId('GitLinkInputComponentTextInput');
    const examineButton = screen.getByText('Load metadata');

    fireEvent.change(textInput, {
      target: { value: 'https://github.com/theforeman/foreman_ansible.git' },
    });

    expect(container).toBeInTheDocument();
    expect(textInput).toHaveValue(
      'https://github.com/theforeman/foreman_ansible.git'
    );
    expect(textInput).toHaveClass('pf-m-success');

    expect(examineButton).toBeEnabled();
  });

  it('tests an invalid input value', () => {
    const { container } = render(
      <GitLinkInputComponent smartProxySelection={['proxy1']} />
    );
    const textInput = screen.getByTestId('GitLinkInputComponentTextInput');
    const examineButton = screen.getByText('Load metadata');

    fireEvent.change(textInput, {
      target: { value: 'https://github.com/theforeman/foreman_ansible' },
    });

    expect(container).toBeInTheDocument();
    expect(textInput).toHaveValue(
      'https://github.com/theforeman/foreman_ansible'
    );
    expect(textInput).toHaveAttribute('aria-invalid', 'true');

    expect(examineButton).toBeDisabled();
  });
});
