import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import { EmptyStatePattern as EmptyState } from 'foremanReact/components/common/EmptyState';

const AnsiblePermissionDenied = props => {
  const description = (
    <span>
      {__('You are not authorized to perform this action.')}
      <br />
      {__(
        'Please request one of the required permissions listed below from a Foreman administrator:'
      )}
      <br />
    </span>
  );

  const doc = (
    <ul className="list-unstyled">
      <li>view_ansible_roles</li>
    </ul>
  );

  return (
    <EmptyState
      iconType="fa"
      icon="lock"
      header={__('Permission Denied')}
      description={description}
      documentation={doc}
    />
  );
};

export default AnsiblePermissionDenied;
