import React from 'react';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';

import { fetchRecurringFn, fetchPreviousFn, renameData } from './JobsTabHelper';

import RecurringJobsTable from './RecurringJobsTable';
import PreviousJobsTable from './PreviousJobsTable';

const JobsTab = ({ response, router }) => (
  <React.Fragment>
    <RecurringJobsTable
      response={response}
      fetchFn={fetchRecurringFn}
      renameData={renameData}
      resultPath="jobInvocations.nodes"
      emptyStateTitle={__('No config job for Ansible roles scheduled')}
      router={router}
    />
    <PreviousJobsTable
      response={response}
      fetchFn={fetchPreviousFn}
      renameData={renameData}
      resultPath="jobInvocations.nodes"
      emptyStateTitle={__('No previous job executions found')}
      router={router}
    />
  </React.Fragment>
);

JobsTab.propTypes = {
  response: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

export default JobsTab;
