import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { translate as __ } from 'foremanReact/common/I18n';

import JobsPage from '../../components/AnsibleHostDetail/components/JobsTab';

const HostgroupJobs = props => (
  <React.Fragment>
    <Helmet>
      <title>{__('Configure Recurring Job')}</title>
    </Helmet>
    <JobsPage
      resourceName="hostgroup"
      resourceId={parseInt(props.match.params.id, 10)}
      history={props.history}
    />
  </React.Fragment>
);

HostgroupJobs.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default HostgroupJobs;
