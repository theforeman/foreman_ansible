import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import AnsibleHostParams from './components/AnsibleHostParams';

addGlobalFill('HostParams', 'AnsibleHostParams', <AnsibleHostParams key="ansible-host-params" />, 300);
addGlobalFill('HostgroupParams', 'AnsibleHostgroupParams', <AnsibleHostParams key="ansible-host-params" />, 300);
