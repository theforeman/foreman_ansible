import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

import withLoading from './withLoading';
import { decodeId } from '../../../../globalIdHelper';
import { formatJobStart } from './JobsTabHelper';

const RecurringJobsTable = props => {
  const columns = [__('Description'), __('Schedule'), __('Next Run')];

  return (
    <React.Fragment>
      <h3>Scheduled recurring jobs</h3>
      <TableComposable variant="compact">
        <Thead>
          <Tr>
            {columns.map((col, idx) => (
              <Th key={idx}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {props.jobs.map((job, idx) => (
            <Tr key={idx}>
              <Td>
                <Link to={`/job_invocations/${decodeId(job.id)}`}>
                  {job.description}
                </Link>
              </Td>
              <Td>{job.recurringLogic.cronLine}</Td>
              <Td>{formatJobStart(job.startAt)}</Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </React.Fragment>
  );
};

RecurringJobsTable.propTypes = {
  jobs: PropTypes.array.isRequired,
};

export default withLoading(RecurringJobsTable);
