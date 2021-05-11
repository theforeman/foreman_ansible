import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';

import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

import { decodeId } from '../../../../globalIdHelper';
import withLoading from '../../../withLoading';

const PreviousJobsTable = props => {
  const columns = [
    __('Description'),
    __('Result'),
    __('State'),
    __('Executed at'),
    __('Schedule'),
  ];

  return (
    <React.Fragment>
      <h3>Previously executed jobs</h3>
      <TableComposable variant="compact">
        <Thead>
          <Tr>
            {columns.map(col => (
              <Th key={col}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {props.jobs.map(job => (
            <Tr key={job.id}>
              <Td>
                <Link to={`/job_invocations/${decodeId(job.id)}`}>
                  {job.description}
                </Link>
              </Td>
              <Td>{job.task.result}</Td>
              <Td>{job.task.state}</Td>
              <Td>
                <RelativeDateTime date={job.startAt} />
              </Td>
              <Td>{job.recurringLogic.cronLine}</Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </React.Fragment>
  );
};

PreviousJobsTable.propTypes = {
  jobs: PropTypes.array.isRequired,
};

export default withLoading(PreviousJobsTable);
