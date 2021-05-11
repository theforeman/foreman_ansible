import React from 'react';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';

import { fetchRecurringFn, fetchPreviousFn, renameData } from './JobsTabHelper';

import RecurringJobsTable from './RecurringJobsTable';
import PreviousJobsTable from './PreviousJobsTable';

const JobsTab = props => (
  <React.Fragment>
    <RecurringJobsTable
      response={props.response}
      fetchFn={fetchRecurringFn}
      renameData={renameData}
      resultPath="jobInvocations.nodes"
      emptyStateTitle={__('No config job for Ansible roles scheduled')}
    />
    <PreviousJobsTable
      response={props.response}
      fetchFn={fetchPreviousFn}
      renameData={renameData}
      resultPath="jobInvocations.nodes"
      emptyStateTitle={__('No previous job executions found')}
    />
  </React.Fragment>
);

JobsTab.propTypes = {
  response: PropTypes.object.isRequired,
};

export default JobsTab;
