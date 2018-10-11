import { differenceBy, slice } from 'lodash';

export const calculateUnassignedRoles = state => differenceBy(state.results, state.assignedRoles, 'id');

export const assignedRolesPage = (assignedRoles, assignedPagination) => {
  const offset = (assignedPagination.page - 1) * assignedPagination.perPage;

  return slice(assignedRoles, offset, offset + assignedPagination.perPage);
};
