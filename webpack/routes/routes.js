import React from 'react';
import HostgroupJobs from './HostgroupJobs';

export default [
  {
    path: '/ansible/hostgroups/:id',
    render: props => <HostgroupJobs {...props} />,
    exact: true,
  },
];
