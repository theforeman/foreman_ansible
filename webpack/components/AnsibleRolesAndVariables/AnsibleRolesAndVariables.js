import React, { useState } from 'react';
import {
	cellWidth
} from '@patternfly/react-table';
import {
	Table,
	TableHeader,
	TableBody
} from '@patternfly/react-table/deprecated';
import {
  Button,
  Toolbar,
  ToolbarGroup,
  ToolbarContent,
  ToolbarItem,
  Checkbox,
} from '@patternfly/react-core';
import Pagination from 'foremanReact/components/Pagination';
import { translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';
import { DEFAULT_PER_PAGE } from './AnsibleRolesAndVariablesConstants';
import './AnsibleRolesAndVariables.scss';

const ImportRolesAndVariablesTable = ({
  columnsData,
  rowsData,
  proxy,
  onSubmit,
  onCancel,
  isImporting,
}) => {
  const columns = columnsData.map(col => ({
    ...col,
    transforms: [cellWidth(10)],
  }));
  const [rows, setRows] = useState(rowsData);

  const [isChecked, setIsChecked] = useState(false);
  const [selectedRowsCount, setSelectRowsCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: DEFAULT_PER_PAGE,
  });
  const [paginatedRows, setPaginatedRows] = useState(
    rows.slice(0, pagination.per_page)
  );

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

  const handleSetPage = args => {
    const startIdx = (args.page - 1) * args.per_page;
    const endIdx =
      rows.length < args.page * args.per_page
        ? rows.length
        : args.page * args.per_page;
    setPagination(args);
    setPaginatedRows(rows.slice(startIdx, endIdx));
  };

  const renderPagination = () => (
    <Pagination
      isCompact
      itemCount={rows.length}
      perPage={pagination.per_page}
      onChange={args => handleSetPage(args)}
    />
  );

  const renderSelectAll = () => (
    <Toolbar ouiaId="ansible-roles-and-variables-table-toolbar">
      <ToolbarContent>
        <ToolbarGroup variant="icon-button-group">
          <ToolbarItem>
            <Checkbox
              ouiaId="ansible-roles-and-variables-table-select-all-checkbox"
              isChecked={isChecked}
              onChange={(_event, checked) => SelectAll(checked)}
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
      <Button
        ouiaId="ansible-roles-variables-submit"
        variant="primary"
        onClick={() => onSubmit(rows, proxy)}
        isLoading={isImporting}
        isDisabled={isImporting || selectedRowsCount === 0}
      >
        {__('Submit')}
      </Button>
      <Button
        ouiaId="ansible-roles-variables-cancel"
        variant="secondary"
        onClick={onCancel}
        isDisabled={isImporting}
      >
        {__('Cancel')}
      </Button>
    </div>
  );

  return (
    <div id="import-ansible-roles-variables">
      {renderSelectAll()}
      <Table
        ouiaId="ansible-roles-and-variables-table"
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
  isImporting: false,
};

ImportRolesAndVariablesTable.propTypes = {
  columnsData: PropTypes.array,
  rowsData: PropTypes.array,
  proxy: PropTypes.number,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  isImporting: PropTypes.bool,
};

export default ImportRolesAndVariablesTable;
