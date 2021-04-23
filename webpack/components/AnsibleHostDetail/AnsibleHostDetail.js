import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import SkeletonLoader from 'foremanReact/components/common/SkeletonLoader';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import { translate as __ } from 'foremanReact/common/I18n';

import AnsibleVariableOverrides from './components/AnsibleVariableOverrides';
import './AnsibleHostDetail.scss';
import WrappedAnsibleHostInventory from './components/AnsibleHostInventory';

const AnsibleHostDetail = ({ response, status }) => {
  // https://projects.theforeman.org/issues/32398
  const [activeTab, setActiveTab] = useState('variables');
  const handleTabClick = (event, tab) => setActiveTab(tab);

  return (
    <SkeletonLoader status={status} skeletonProps={{ count: 5 }}>
      {response && (
        <Tabs onSelect={handleTabClick} activeKey={activeTab} isSecondary>
          <Tab
            eventKey="variables"
            title={<TabTitleText>{__('Variables')}</TabTitleText>}
          >
            <div className="host-details-tab-item">
              <div className="ansible-host-detail">
                <AnsibleVariableOverrides id={response.id} hostAttrs={response} />
              </div>
            </div>
          </Tab>
          <Tab
            eventKey="inventory"
            title={<TabTitleText>{__('Inventory')}</TabTitleText>}
          >
            <WrappedAnsibleHostInventory hostId={response.id} />
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
