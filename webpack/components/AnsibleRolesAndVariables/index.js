import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';

import { STATUS } from 'foremanReact/constants';
import { translate as __ } from 'foremanReact/common/I18n';

import ImportRolesAndVariablesTable from './AnsibleRolesAndVariables';
import { onSubmit } from './AnsibleRolesAndVariablesActions';
import { ANSIBLE_ROLES_INDEX } from './AnsibleRolesAndVariablesConstants';
import { selectApiImportStatus } from './AnsibleRolesAndVariablesSelectors';

const WrappedImportRolesAndVariables = props => {
  const cols = [
    { title: __('Name') },
    { title: __('Operation') },
    { title: __('Variables') },
    { title: __('Host count') },
    { title: __('Hostgroup count') },
  ];
  const dispatch = useDispatch();
  const submit = (rows, proxy) => dispatch(onSubmit(rows, proxy));
  const onCancel = () => {
    dispatch(push(ANSIBLE_ROLES_INDEX));
  };
  const apiImportStatus = useSelector(selectApiImportStatus);

  return (
    <ImportRolesAndVariablesTable
      {...props}
      columnsData={cols}
      onSubmit={submit}
      onCancel={onCancel}
      isImporting={apiImportStatus === STATUS.PENDING}
    />
  );
};
export default WrappedImportRolesAndVariables;
