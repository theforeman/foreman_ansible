import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';

import { Grid, GridItem, Button } from '@patternfly/react-core';

import { fetchRecurringFn, fetchPreviousFn, renameData } from './JobsTabHelper';

import RecurringJobsTable from './RecurringJobsTable';
import PreviousJobsTable from './PreviousJobsTable';
import NewRecurringJobModal from './NewRecurringJobModal';

const JobsTab = ({ response }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const scheduleBtn = (
    <Button aria-label="schedule recurring job" onClick={toggleModal}>
      {__('Schedule recurring job')}
    </Button>
  );

  return (
    <Grid>
      <GridItem span={12}>
        <RecurringJobsTable
          hostId={response.id}
          fetchFn={fetchRecurringFn}
          renameData={renameData}
          resultPath="jobInvocations.nodes"
          emptyStateProps={{
            header: __('No config job for Ansible roles scheduled'),
            action: scheduleBtn,
          }}
        />
      </GridItem>
      <GridItem span={12}>
        <PreviousJobsTable
          hostId={response.id}
          fetchFn={fetchPreviousFn}
          renameData={renameData}
          resultPath="jobInvocations.nodes"
          emptyStateProps={{ header: __('No previous job executions found') }}
        />
      </GridItem>
      <NewRecurringJobModal
        isOpen={modalOpen}
        onClose={toggleModal}
        hostId={response.id}
      />
    </Grid>
  );
};

JobsTab.propTypes = {
  response: PropTypes.object.isRequired,
};

export default JobsTab;
