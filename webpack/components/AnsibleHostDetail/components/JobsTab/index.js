import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';

import { Grid, GridItem, Button } from '@patternfly/react-core';

import { fetchRecurringFn, fetchPreviousFn, renameData } from './JobsTabHelper';

import RecurringJobsTable from './RecurringJobsTable';
import PreviousJobsTable from './PreviousJobsTable';
import NewRecurringJobModal from './NewRecurringJobModal';

const JobsTab = ({ resourceName, resourceId }) => {
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
          resourceId={resourceId}
          resourceName={resourceName}
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
          resourceId={resourceId}
          resourceName={resourceName}
          fetchFn={fetchPreviousFn}
          renameData={renameData}
          emptyWrapper={() => null}
          resultPath="jobInvocations.nodes"
        />
      </GridItem>
      <NewRecurringJobModal
        isOpen={modalOpen}
        onClose={toggleModal}
        resourceId={resourceId}
        resourceName={resourceName}
      />
    </Grid>
  );
};

JobsTab.propTypes = {
  resourceName: PropTypes.string.isRequired,
  resourceId: PropTypes.number.isRequired,
};

export default JobsTab;
