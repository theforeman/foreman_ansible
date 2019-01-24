import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AnsibleRolesSwitcher from './AnsibleRolesSwitcher';
import * as AnsibleRolesSwitcherActions from './AnsibleRolesSwitcherActions';
import AnsiblePermissionDenied from './components/AnsiblePermissionDenied';
import withProtectedView from './components/withProtectedView';
import {
  selectUnassignedRoles,
  selectAssignedRolesPage,
  selectAssignedRolesCount,
  selectResults,
  selectPaginationMemoized,
  selectItemCount,
  selectLoading,
  selectAssignedPagination,
  selectError,
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
  unassignedRoles: selectUnassignedRoles(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(AnsibleRolesSwitcherActions, dispatch);

export default withProtectedView(
  connect(mapStateToProps, mapDispatchToProps)(AnsibleRolesSwitcher),
  AnsiblePermissionDenied,
  props => (props.data && props.data.canView),
);
