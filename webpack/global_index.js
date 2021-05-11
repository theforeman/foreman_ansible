import React from 'react';
import { registerRoutes } from 'foremanReact/routes/RoutingService';

import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';

import routes from './routes/routes';
import AnsibleHostDetail from './components/AnsibleHostDetail';

import { ANSIBLE_KEY } from './components/AnsibleHostDetail/constants';

addGlobalFill(
  'host-details-page-tabs',
  ANSIBLE_KEY,
  <AnsibleHostDetail key="ansible-host-detail" />,
  500
);

registerRoutes('foreman_ansible', routes);
