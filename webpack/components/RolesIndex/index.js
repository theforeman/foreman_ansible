import React from 'react';
import { useDispatch } from 'react-redux';

import RolesIndex from './RolesIndex';
import { onDelete } from './RolesIndexActions';

const WrappedRolesIndex = props => {
  const dispatch = useDispatch();
  const actions = rows => [
    {
      title: 'Delete',
      onClick: (event, rowId, rowData, extra) => {
        event.preventDefault();
        dispatch(onDelete(rows[rowId].role));
      },
    },
  ];

  return <RolesIndex RolesIndexActions={actions} {...props} />;
};

export default WrappedRolesIndex;
