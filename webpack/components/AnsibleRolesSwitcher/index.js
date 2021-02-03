import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AnsibleRolesSwitcher from './AnsibleRolesSwitcher';
import * as AnsibleRolesSwitcherActions from './AnsibleRolesSwitcherActions';
import AnsiblePermissionDenied from './components/AnsiblePermissionDenied';
import withProtectedView from './components/withProtectedView';
import {
  selectUnassignedRoles,
  selectAssignedRolesPage,
  selectAssignedRoles,
  selectAssignedRolesCount,
  selectResults,
  selectPaginationMemoized,
  selectItemCount,
  selectLoading,
  selectAssignedPagination,
  selectError,
  selectToDestroyRoles,
} from './AnsibleRolesSwitcherSelectors';

const mapStateToProps = state => ({
  results: selectResults(state),
  pagination: selectPaginationMemoized(state),
  itemCount: selectItemCount(state),
  loading: selectLoading(state),
  error: selectError(state),
  assignedPagination: selectAssignedPagination(state),
  assignedRolesCount: selectAssignedRolesCount(state),
  assignedRoles: selectAssignedRolesPage(state),
  allAssignedRoles: selectAssignedRoles(state),
  unassignedRoles: selectUnassignedRoles(state),
  toDestroyRoles: selectToDestroyRoles(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(AnsibleRolesSwitcherActions, dispatch);

export default withProtectedView(
  connect(mapStateToProps, mapDispatchToProps)(AnsibleRolesSwitcher),
  AnsiblePermissionDenied,
  props => props.canView
);
