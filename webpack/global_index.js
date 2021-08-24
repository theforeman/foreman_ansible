import React from 'react';

import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';

import AnsibleHostDetail from './components/AnsibleHostDetail';
import { ANSIBLE_KEY } from './components/AnsibleHostDetail/constants';

addGlobalFill(
  'host-details-page-tabs',
  ANSIBLE_KEY,
  <AnsibleHostDetail key="ansible-host-detail" />,
  500
);
