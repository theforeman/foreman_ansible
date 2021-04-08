import React, { useState } from 'react';
import { Pagination } from '@patternfly/react-core';
import { usePaginationOptions } from 'foremanReact/components/Pagination/PaginationHooks';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';

const withPagination = Component => componentProps => {
  const [page, setPage] = useState();
  const [perPage, setPerPage] = useState(useForemanSettings().perPage);
  const [paginatedRows, setPaginatedRows] = useState(
    componentProps.rows.slice(0, perPage)
  );
  const handlePerPageSelect = (
    event,
    newPerPage,
    newPage,
    startIdx,
    endIdx
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
    setPaginatedRows(componentProps.rows.slice(startIdx, endIdx));
  };
  const perPageOptions = usePaginationOptions().map(item => ({
    title: item.toString(),
    value: item,
  }));
  const handleSetPage = (event, newPage) => {
    const startIdx = (newPage - 1) * perPage;
    const endIdx =
      componentProps.rows.length < newPage * perPage
        ? componentProps.rows.length
        : newPage * perPage;
    setPage(newPage);
    setPaginatedRows(componentProps.rows.slice(startIdx, endIdx));
  };

  return (
    <div>
      <Component {...componentProps} paginatedRows={paginatedRows} />
      <Pagination
        isCompact
        itemCount={componentProps.rows.length}
        page={page}
        perPage={perPage}
        defaultToFullPage
        onSetPage={handleSetPage}
        onPerPageSelect={handlePerPageSelect}
        perPageOptions={perPageOptions}
        titles={{ paginationTitle: 'top pagination' }}
      />
    </div>
  );
};

export default withPagination;
