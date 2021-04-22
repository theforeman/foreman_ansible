import React, { useState } from 'react';
import { Tabs, Tab, TabTitleText, Label } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import { translate as __ } from 'foremanReact/common/I18n';

import './AnsibleHostDetail.scss';

const AnsibleHostDetail = props => {
  // https://projects.theforeman.org/issues/32398
  const [activeTab] = useState('variables');

  return (
    <div className="ansible-host-detail">
      <Tabs activeKey={activeTab} isSecondary>
        <Tab
          eventKey="variables"
          title={<TabTitleText>{__('Variables')}</TabTitleText>}
        >
          <Label
            color="blue"
            icon={<InfoCircleIcon />}
            style={{ marginTop: '1.5rem' }}
          >
            Ansible Variables coming soon!
          </Label>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AnsibleHostDetail;
