import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import ImportRolesAndVariablesTable from './AnsibleRolesAndVariables';
import { onSubmit } from './AnsibleRolesAndVariablesActions';
import { ANSIBLE_ROLES_INDEX } from './AnsibleRolesAndVariablesConstants';

const WrappedImportRolesAndVariables = props => {
  const cols = [
    { title: 'Name' },
    { title: 'Operation' },
    { title: 'Variables' },
    { title: 'Hosts Count' },
    { title: 'Hostgroups count' },
  ];
  const dispatch = useDispatch();
  const submit = (rows, proxy) => dispatch(onSubmit(rows, proxy));
  const onCancel = () => {
    dispatch(push(ANSIBLE_ROLES_INDEX));
  };
  return (
    <ImportRolesAndVariablesTable
      {...props}
      columnsData={cols}
      onSubmit={submit}
      onCancel={onCancel}
    />
  );
};
export default WrappedImportRolesAndVariables;
