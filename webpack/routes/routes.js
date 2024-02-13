import React from 'react';
import HostgroupJobs from './HostgroupJobs';
import AnsibleRoles from './AnsibleRoles';

export default [
  {
    path: '/ansible/hostgroups/:id',
    render: props => <HostgroupJobs {...props} />,
    exact: true,
  },
  {
    path: '/ansible/ansible_roles',
    render: props => <AnsibleRoles {...props} />,
    exact: true,
  },
];
