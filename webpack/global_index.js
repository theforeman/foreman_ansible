import React from 'react';

import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';

import AnsibleHostDetail from './components/AnsibleHostDetail';

addGlobalFill(
  'host-details-page-tabs',
  'Ansible',
  <AnsibleHostDetail key="ansible-host-detail" />,
  500
);
