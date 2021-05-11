import React from 'react';
import PropTypes from 'prop-types';
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

import withLoading from '../../../withLoading';
import { decodeId } from '../../../../globalIdHelper';

const RecurringJobsTable = props => {
  const columns = [__('Description'), __('Schedule'), __('Next Run')];

  return (
    <React.Fragment>
      <h3>{__('Scheduled recurring jobs')}</h3>
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
                <a
                  onClick={() =>
                    window.tfm.nav.pushUrl(
                      `/job_invocations/${decodeId(job.id)}`
                    )
                  }
                >
                  {job.description}
                </a>
              </Td>
              <Td>{job.recurringLogic.cronLine}</Td>
              <Td>
                <RelativeDateTime date={job.startAt} />
              </Td>
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
