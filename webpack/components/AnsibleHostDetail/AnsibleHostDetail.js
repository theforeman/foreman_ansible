import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabTitleText, Label } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import { translate as __ } from 'foremanReact/common/I18n';
import Skeleton from 'react-loading-skeleton';

import JobsTab from './components/JobsTab';

import './AnsibleHostDetail.scss';

const AnsibleHostDetail = props => {
  // https://projects.theforeman.org/issues/32398
  const [activeTab, setActiveTab] = useState('variables');

  const handleTabChange = (event, value) => {
    setActiveTab(value);
  };

  if (props.status === 'PENDING') {
    return <Skeleton count={5} />;
  }

  return (
    <Tabs
      mountOnEnter
      activeKey={activeTab}
      isSecondary
      onSelect={handleTabChange}
    >
      <Tab
        eventKey="variables"
        title={<TabTitleText>{__('Variables')}</TabTitleText>}
      >
        <div className="host-details-tab-item">
          <div className="ansible-host-detail">
            <Label
              color="blue"
              icon={<InfoCircleIcon />}
              style={{ marginTop: '1.5rem' }}
            >
              Ansible Variables coming soon!
            </Label>
          </div>
        </div>
      </Tab>
      <Tab eventKey="jobs" title={<TabTitleText>{__('Jobs')}</TabTitleText>}>
        <div className="ansible-host-detail">
          <JobsTab {...props} />
        </div>
      </Tab>
    </Tabs>
  );
};

AnsibleHostDetail.propTypes = {
  status: PropTypes.string.isRequired,
};

export default AnsibleHostDetail;
