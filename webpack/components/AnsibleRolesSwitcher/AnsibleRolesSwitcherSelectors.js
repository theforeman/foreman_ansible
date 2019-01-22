import { differenceBy, slice } from 'lodash';

export const calculateUnassignedRoles = state => differenceBy(state.results, state.assignedRoles, 'id');

export const assignedRolesPage = (assignedRoles, assignedPagination) => {
  const offset = (assignedPagination.page - 1) * assignedPagination.perPage;

  return slice(assignedRoles, offset, offset + assignedPagination.perPage);
};

export const removeItemNewState = (state, role) => ({
  assignedRoles: removeItem(state.assignedRoles, role),
  itemCount: state.itemCount + 1,
});

export const addItemNewState = (state, role) => ({
  assignedRoles: addItem(state.assignedRoles, role),
  itemCount: state.itemCount - 1,
});

const addItem = (list, item) => ([...(list || []), item]);

const removeItem = (list, item) => list.filter(listItem => item.id !== listItem.id);
