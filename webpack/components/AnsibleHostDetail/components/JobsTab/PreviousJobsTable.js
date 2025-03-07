import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';

import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { Flex, FlexItem } from '@patternfly/react-core';
import Pagination from 'foremanReact/components/Pagination';

import { decodeId } from '../../../../globalIdHelper';
import withLoading from '../../../withLoading';
import { readableCron, readablePurpose } from './JobsTabHelper';

const PreviousJobsTable = ({ history, totalCount, jobs, pagination }) => {
  const columns = [
    __('Description'),
    __('Result'),
    __('State'),
    __('Executed at'),
    __('Schedule'),
  ];

  return (
    <React.Fragment>
      <h3>{__('Previously executed jobs')}</h3>
      <Flex direction={{ default: 'column' }} className="pf-u-pt-md">
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination
            ouiaId="pagination-top"
            updateParamsByUrl
            itemCount={totalCount}
            variant="top"
          />
        </FlexItem>
        <FlexItem>
          <Table ouiaId="table-composable-compact" variant="compact">
            <Thead>
              <Tr ouiaId="row-header">
                {columns.map(col => (
                  <Th key={col}>{col}</Th>
                ))}
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
                  <Td>{job.task.result}</Td>
                  <Td>{job.task.state}</Td>
                  <Td>
                    <RelativeDateTime date={job.startAt} />
                  </Td>
                  <Td>{readableCron(job.recurringLogic.cronLine)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination
            ouiaId="pagination-bottom"
            updateParamsByUrl
            itemCount={totalCount}
            variant="bottom"
          />
        </FlexItem>
      </Flex>
    </React.Fragment>
  );
};

PreviousJobsTable.propTypes = {
  jobs: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  totalCount: PropTypes.number.isRequired,
  pagination: PropTypes.object.isRequired,
};

export default withLoading(PreviousJobsTable);
