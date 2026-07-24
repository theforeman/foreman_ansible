import React from 'react';
import { registerRoutes } from 'foremanReact/routes/RoutingService';

import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';

import routes from './routes/routes';
import AnsibleHostDetail from './components/AnsibleHostDetail';

import { ANSIBLE_KEY } from './components/AnsibleHostDetail/constants';

const ANSIBLE_TAB_WEIGHT = 500;

addGlobalFill(
  'host-details-page-tabs',
  ANSIBLE_KEY,
  <AnsibleHostDetail key="ansible-host-detail" />,
  ANSIBLE_TAB_WEIGHT
);

registerRoutes('foreman_ansible', routes);
