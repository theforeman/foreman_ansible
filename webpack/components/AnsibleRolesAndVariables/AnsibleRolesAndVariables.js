import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  cellWidth,
} from '@patternfly/react-table';
import {
  Button,
  Toolbar,
  ToolbarGroup,
  ToolbarContent,
  ToolbarItem,
  Checkbox,
} from '@patternfly/react-core';
import Pagination from 'foremanReact/components/Pagination';
import PropTypes from 'prop-types';
import { DEFAULT_PER_PAGE } from './AnsibleRolesAndVariablesConstants';
import './AnsibleRolesAndVariables.scss';

const ImportRolesAndVariablesTable = ({
  columnsData,
  rowsData,
  proxy,
  onSubmit,
  onCancel,
}) => {
  const columns = columnsData.map(col => ({
    ...col,
    transforms: [cellWidth(10)],
  }));
  const [rows, setRows] = useState(rowsData);

  const [isChecked, setIsChecked] = useState(false);
  const [selectedRowsCount, setSelectRowsCount] = useState(0);

  const [page, setPage] = useState();
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [paginatedRows, setPaginatedRows] = useState(rows.slice(0, perPage));

  const onSelect = (event, isSelected, rowId, row) => {
    const selectableRowLength = rows.filter(
      tempRow => tempRow.parent === undefined
    ).length;
    let rowsCount = selectedRowsCount;
    const tempRows = rows.map(tempRow => {
      if (rowId === -1) {
        tempRow.selected = isSelected;
        setIsChecked(isSelected);
        setSelectRowsCount(isSelected ? selectableRowLength : 0);
      } else if (tempRow.id === row.id) {
        tempRow.selected = isSelected;
        rowsCount = isSelected ? selectedRowsCount + 1 : selectedRowsCount - 1;
        if (rowsCount > 0 && rowsCount === selectableRowLength) {
          setIsChecked(true);
        } else {
          setIsChecked(false);
        }
        setSelectRowsCount(rowsCount);
      }
      return tempRow;
    });
    setRows(tempRows);
  };

  const SelectAll = checked => {
    onSelect(null, checked, -1);
  };

  const handleSetPage = (event, newPage) => {
    const startIdx = (newPage - 1) * perPage;
    const endIdx =
      rows.length < newPage * perPage ? rows.length : newPage * perPage;
    setPage(newPage);
    setPaginatedRows(rows.slice(startIdx, endIdx));
  };

  const handlePerPageSelect = (
    event,
    newPerPage,
    newPage,
    startIdx,
    endIdx
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
    setPaginatedRows(rows.slice(startIdx, endIdx));
  };

  const renderPagination = (variant = 'top') => (
    <Pagination
      isCompact
      itemCount={rows.length}
      page={page}
      perPage={perPage}
      defaultToFullPage
      onSetPage={handleSetPage}
      onPerPageSelect={handlePerPageSelect}
      perPageOptions={[
        { title: '3', value: 3 },
        { title: '5', value: 5 },
        { title: '10', value: 10 },
      ]}
      titles={{
        paginationTitle: `${variant} pagination`,
      }}
    />
  );

  const renderSelectAll = () => (
    <Toolbar>
      <ToolbarContent>
        <ToolbarGroup variant="icon-button-group">
          <ToolbarItem>
            <Checkbox
              isChecked={isChecked}
              onChange={SelectAll}
              aria-label="select all checkbox"
              id="select-all"
              name="select-all"
              label={isChecked ? 'Deselect all' : 'Select all'}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  const renderSubmitAndCancel = () => (
    <div className="submit-cancel-btns">
      <br />
      <br />
      <Button variant="primary" onClick={() => onSubmit(rows, proxy)}>
        Submit
      </Button>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );

  return (
    <div id="import-ansible-roles-variables">
      {renderSelectAll()}
      <Table
        aria-label="import roles and variables"
        onSelect={onSelect}
        rows={paginatedRows}
        cells={columns}
        canSelectAll={false}
      >
        <TableHeader />
        <TableBody />
      </Table>
      {renderPagination()}
      {renderSubmitAndCancel()}
    </div>
  );
};

ImportRolesAndVariablesTable.defaultProps = {
  columnsData: undefined,
  rowsData: [],
  proxy: undefined,
  onSubmit: undefined,
  onCancel: undefined,
};

ImportRolesAndVariablesTable.propTypes = {
  columnsData: PropTypes.array,
  rowsData: PropTypes.array,
  proxy: PropTypes.number,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ImportRolesAndVariablesTable;
