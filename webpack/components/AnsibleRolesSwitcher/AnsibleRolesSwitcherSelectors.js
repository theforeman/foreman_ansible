import { differenceBy, includes } from 'lodash';
import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { propsToCamelCase } from 'foremanReact/common/helpers';

const switcherState = state => state.foremanAnsible.ansibleRolesSwitcher;

const markInheritedRoles = (roles, inheritedRoleIds) =>
  roles.map(role =>
    includes(inheritedRoleIds, role.id) ? { ...role, inherited: true } : role
  );

const selectResults = state =>
  Immutable(
    Immutable.asMutable(switcherState(state).results.map(propsToCamelCase))
  );

export const selectAssignedRoles = state =>
  Immutable.asMutable(
    markInheritedRoles(
      switcherState(state).assignedRoles.map(propsToCamelCase),
      switcherState(state).inheritedRoleIds
    )
  );

export const selectToDestroyRoles = state =>
  Immutable.asMutable(
    switcherState(state).toDestroyRoles.map(propsToCamelCase)
  );

export const selectLoading = state => switcherState(state).loading;
export const selectError = state => switcherState(state).error;

export const selectUnassignedRoles = createSelector(
  selectResults,
  selectAssignedRoles,
  (results, assignedRoles) => differenceBy(results, assignedRoles, 'id')
);
