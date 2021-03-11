import { differenceBy, includes } from 'lodash';
import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { propsToCamelCase } from 'foremanReact/common/helpers';

const switcherState = state => state.foremanAnsible.ansibleRolesSwitcher;

const markInheritedRoles = (roles, inheritedRoleIds) =>
  roles.map(role =>
    includes(inheritedRoleIds, role.id) ? { ...role, inherited: true } : role
  );

export const selectResults = state =>
  Immutable(
    Immutable.asMutable(switcherState(state).results.map(propsToCamelCase))
  );

export const selectItemCount = state => switcherState(state).itemCount;

export const selectAssignedRoles = state =>
  Immutable.asMutable(
    markInheritedRoles(
      switcherState(state).assignedRoles.map(propsToCamelCase),
      switcherState(state).inheritedRoleIds
    )
  );

export const selectToDestroyRoles = state =>
  switcherState(state).toDestroyRoles;

export const selectLoading = state => switcherState(state).loading;
export const selectError = state => switcherState(state).error;
export const selectPagination = state => switcherState(state).pagination;

export const selectPaginationMemoized = createSelector(
  selectPagination,
  selectResults,
  (pagination, results) =>
    results.length > pagination.perPage
      ? { ...pagination, perPage: results.length }
      : pagination
);

export const selectUnassignedRoles = createSelector(
  selectResults,
  selectAssignedRoles,
  (results, assignedRoles) => differenceBy(results, assignedRoles, 'id')
);
