import React from 'react';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { importUrl } from '../AnsibleRolesPageHelpers';
import { showToast } from '../../../toastHelper';

export const AnsibleRolesImportButton = () => {
  let dropdownItems;

  const {
    response: { results },
    status,
  } = useAPI('get', '/api/v2/smart_proxies', {
    params: { search: 'feature=Ansible', per_page: 'all' },
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const onToggle = isToggleOpen => {
    setIsOpen(isToggleOpen);
  };
  const onFocus = () => {
    const element = document.getElementById('toggle-primary');
    element.focus();
  };
  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  if (status === 'PENDING') {
    dropdownItems = [
      <DropdownItem isDisabled key="loading_item">
        {__('Loading...')}
      </DropdownItem>,
    ];
  } else if (status === 'ERROR') {
    showToast({
      type: 'error',
      message: __('There was an error requesting Smart Proxies'),
    });
  } else if (status === 'RESOLVED') {
    dropdownItems = results.map(proxy => (
      <DropdownItem key={proxy.name} href={importUrl(proxy.name, proxy.id)}>
        {proxy.name}
      </DropdownItem>
    ));
    if (dropdownItems.length === 0) {
      dropdownItems = [
        <DropdownItem isDisabled key="none_found">
          {__('No Smart Proxies found')}
        </DropdownItem>,
      ];
    }
  }
  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <DropdownToggle
          id="toggle-primary"
          toggleVariant="primary"
          onToggle={onToggle}
        >
          {__('Import from')}
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};
