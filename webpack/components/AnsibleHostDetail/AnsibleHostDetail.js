import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import SkeletonLoader from 'foremanReact/components/common/SkeletonLoader';

import { translate as __ } from 'foremanReact/common/I18n';

import AnsibleVariableOverrides from './components/AnsibleVariableOverrides';

import RolesTab from './components/RolesTab';
import TabLayout from './components/TabLayout';

import './AnsibleHostDetail.scss';
import WrappedAnsibleHostInventory from './components/AnsibleHostInventory';

const AnsibleHostDetail = ({ response, status }) => {
  // https://projects.theforeman.org/issues/32398
  const [activeTab, setActiveTab] = useState('roles');
  const handleTabClick = (event, tab) => setActiveTab(tab);

  return (
    <SkeletonLoader status={status} skeletonProps={{ count: 5 }}>
      {response && (
        <Tabs onSelect={handleTabClick} activeKey={activeTab} isSecondary>
          <Tab
            eventKey="roles"
            title={<TabTitleText>{__('Roles')}</TabTitleText>}
          >
            <TabLayout>
              <RolesTab hostId={response.id} />
            </TabLayout>
          </Tab>
          <Tab
            eventKey="variables"
            title={<TabTitleText>{__('Variables')}</TabTitleText>}
          >
            <TabLayout>
              <AnsibleVariableOverrides id={response.id} />
            </TabLayout>
          </Tab>
          <Tab
            eventKey="inventory"
            title={<TabTitleText>{__('Inventory')}</TabTitleText>}
          >
            <TabLayout>
              <WrappedAnsibleHostInventory hostId={response.id} />
            </TabLayout>
          </Tab>
        </Tabs>
      )}
    </SkeletonLoader>
  );
};

AnsibleHostDetail.propTypes = {
  response: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

export default AnsibleHostDetail;
