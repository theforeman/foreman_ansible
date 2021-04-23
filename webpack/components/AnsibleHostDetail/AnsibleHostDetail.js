import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import Loading from 'foremanReact/components/Loading';
import { translate as __ } from 'foremanReact/common/I18n';

import AnsibleVariableOverrides from './components/AnsibleVariableOverrides';
import './AnsibleHostDetail.scss';

const AnsibleHostDetail = ({ response, status }) => {
  // https://projects.theforeman.org/issues/32398
  const [activeTab] = useState('variables');

  if (status === 'PENDING') {
    return <Loading />;
  }

  return (
    <div className="ansible-host-detail">
      <Tabs activeKey={activeTab} isSecondary>
        <Tab
          eventKey="variables"
          title={<TabTitleText>{__('Variables')}</TabTitleText>}
        >
          <AnsibleVariableOverrides id={response.id} hostAttrs={response} />
        </Tab>
      </Tabs>
    </div>
  );
};

AnsibleHostDetail.propTypes = {
  response: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

export default AnsibleHostDetail;
