import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';
import { openConfirmModal } from 'foremanReact/components/ConfirmModal';

import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

import {
  useCancelMutation,
  readableCron,
  readablePurpose,
} from './JobsTabHelper';
import withLoading from '../../../withLoading';
import { decodeId } from '../../../../globalIdHelper';

const RecurringJobsTable = ({
  jobs,
  resourceName,
  resourceId,
  hostGroupId,
}) => {
  const columns = [__('Description'), __('Schedule'), __('Next Run')];
  const dispatch = useDispatch();

  const [callMutation] = useCancelMutation(resourceName, resourceId);

  const onJobCancel = rlId => () => {
    dispatch(
      openConfirmModal({
        title: __('Cancel Ansible config job'),
        message: __('Are you sure you want to cancel Ansible config job?'),
        isWarning: true,
        onConfirm: () => callMutation({ variables: { id: rlId } }),
      })
    );
  };

  const actionItems = job => {
    const items = [];
    if (job.recurringLogic.meta.canEdit) {
      items.push({
        title: __('Cancel'),
        onClick: onJobCancel(job.recurringLogic.id),
        key: 'cancel',
      });
    }

    return { items };
  };

  return (
    <React.Fragment>
      <h3>{__('Scheduled recurring jobs')}</h3>
      <Table ouiaId="table-composable-compact" variant="compact">
        <Thead>
          <Tr ouiaId="row-header">
            {columns.map(col => (
              <Th key={col}>{col}</Th>
            ))}
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {jobs.map(job => (
            <Tr key={job.id} ouiaId={`row-${job.id}`}>
              <Td>
                <a
                  onClick={() =>
                    window.tfm.nav.pushUrl(
                      `/job_invocations/${decodeId(job.id)}`
                    )
                  }
                >
                  {job.description}
                </a>
                &nbsp;
                {readablePurpose(job.recurringLogic.purpose)}
              </Td>
              <Td>{readableCron(job.recurringLogic.cronLine)}</Td>
              <Td>
                <RelativeDateTime date={job.startAt} />
              </Td>
              <Td actions={actionItems(job)} />
            </Tr>
          ))}
        </Tbody>
      </Table>
    </React.Fragment>
  );
};

RecurringJobsTable.propTypes = {
  jobs: PropTypes.array.isRequired,
  resourceId: PropTypes.number.isRequired,
  resourceName: PropTypes.string.isRequired,
  hostGroupId: PropTypes.number,
};

RecurringJobsTable.defaultProps = {
  hostGroupId: undefined,
};

export default withLoading(RecurringJobsTable);
