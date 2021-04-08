import React from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import PropTypes from 'prop-types';
import { linkCellFormatter } from './RolesIndexConstants';
import withPagination from '../WithPagination';

const RolesIndex = ({ rows, RolesIndexActions, paginatedRows }) => {
  const cols = [
    { title: 'Name' },
    { title: 'Variables', cellTransforms: [linkCellFormatter] },
    { title: 'Hostgroups' },
    { title: 'Hosts', cellTransforms: [linkCellFormatter] },
    { title: 'Imported at' },
  ];

  return (
    <div id="roles-index-table">
      <Table
        aria-label="roles index"
        rows={paginatedRows}
        actions={RolesIndexActions(rows)}
        cells={cols}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </div>
  );
};

RolesIndex.defaultProps = {
  rows: [],
  RolesIndexActions: () => {},
  paginatedRows: [],
};

RolesIndex.propTypes = {
  rows: PropTypes.array,
  RolesIndexActions: PropTypes.func,
  paginatedRows: PropTypes.array,
};
export default withPagination(RolesIndex);
