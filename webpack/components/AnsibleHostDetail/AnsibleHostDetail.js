import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import SkeletonLoader from 'foremanReact/components/common/SkeletonLoader';
import { translate as __ } from 'foremanReact/common/I18n';

import AnsibleVariableOverrides from './components/AnsibleVariableOverrides';
import './AnsibleHostDetail.scss';

const AnsibleHostDetail = ({ response, status }) => {
  // https://projects.theforeman.org/issues/32398
  const [activeTab] = useState('variables');

  return (
    <SkeletonLoader status={status} skeletonProps={{ count: 5 }}>
      <Tabs activeKey={activeTab} isSecondary>
        <Tab
          eventKey="variables"
          title={<TabTitleText>{__('Variables')}</TabTitleText>}
        >
          <div className="host-details-tab-item">
            <div className="ansible-host-detail">
              <AnsibleVariableOverrides hostAttrs={response} />
            </div>
          </div>
        </Tab>
      </Tabs>
    </SkeletonLoader>
  );
};

AnsibleHostDetail.propTypes = {
  response: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

export default AnsibleHostDetail;
