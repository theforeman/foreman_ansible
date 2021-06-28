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
    <Tabs activeKey={activeTab} isSecondary>
      <Tab
        eventKey="variables"
        title={<TabTitleText>{__('Variables')}</TabTitleText>}
      >
        <div className="host-details-tab-item">
          <div className="ansible-host-detail">
            <SkeletonLoader status={status} skeletonProps={{ count: 5 }}>
              <AnsibleVariableOverrides id={response.id} hostAttrs={response} />
            </SkeletonLoader>
          </div>
        </div>
      </Tab>
    </Tabs>
  );
};

AnsibleHostDetail.propTypes = {
  response: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

export default AnsibleHostDetail;
