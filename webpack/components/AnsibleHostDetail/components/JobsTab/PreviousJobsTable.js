import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { usePaginationOptions } from 'foremanReact/components/Pagination/PaginationHooks';

import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { Flex, FlexItem, Pagination } from '@patternfly/react-core';

import { decodeId } from '../../../../globalIdHelper';
import withLoading from '../../../withLoading';
import { readableCron, readablePurpose } from './JobsTabHelper';
import {
  preparePerPageOptions,
  refreshPage,
} from '../../../../helpers/paginationHelper';

const PreviousJobsTable = ({ history, totalCount, jobs, pagination }) => {
  const columns = [
    __('Description'),
    __('Result'),
    __('State'),
    __('Executed at'),
    __('Schedule'),
  ];

  const handlePerPageSelected = (event, perPage) => {
    refreshPage(history, { page: 1, perPage });
  };

  const handlePageSelected = (event, page) => {
    refreshPage(history, { ...pagination, page });
  };

  const perPageOptions = preparePerPageOptions(usePaginationOptions());

  return (
    <React.Fragment>
      <h3>{__('Previously executed jobs')}</h3>
      <Flex className="pf-u-pt-md">
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination
            itemCount={totalCount}
            page={pagination.page}
            perPage={pagination.perPage}
            onSetPage={handlePageSelected}
            onPerPageSelect={handlePerPageSelected}
            perPageOptions={perPageOptions}
            variant="top"
          />
        </FlexItem>
      </Flex>
      <TableComposable variant="compact">
        <Thead>
          <Tr>
            {columns.map(col => (
              <Th key={col}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {jobs.map(job => (
            <Tr key={job.id}>
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
      </TableComposable>
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
