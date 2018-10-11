import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { lowerCase } from 'lodash';

import AnsibleRolesSwitcher from './AnsibleRolesSwitcher';
import * as AnsibleRolesSwitcherActions from './AnsibleRolesSwitcherActions';
import { calculateUnassignedRoles, assignedRolesPage } from './AnsibleRolesSwitcherSelectors';

const mapStateToProps = ({ foreman_ansible: { ansibleRolesSwitcher } }, ownProps) => {
  const {
    results,
    pagination,
    itemCount,
    assignedRoles,
    loading,
    assignedPagination,
    error,
  } = ansibleRolesSwitcher;

  const { data: { resourceName = '', initialAssignedRoles } } = ownProps;

  return ({
    results,
    pagination,
    itemCount,
    loading,
    error,
    initialAssignedRoles,
    assignedPagination,
    assignedRolesCount: assignedRoles.length,
    resourceName: lowerCase(resourceName),
    assignedRoles: assignedRolesPage(
      ansibleRolesSwitcher.assignedRoles,
      ansibleRolesSwitcher.assignedPagination,
    ),
    unassignedRoles: calculateUnassignedRoles(ansibleRolesSwitcher),
  });
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    data: {
      availableRolesUrl,
      initialAssignedRoles,
      inheritedRoleIds,
      resourceId,
      resourceName,
    },
  } = ownProps;

  return {
    getAnsibleRoles: bindActionCreators(
      AnsibleRolesSwitcherActions.getAnsibleRoles,
      dispatch,
    )(
      availableRolesUrl,
      initialAssignedRoles,
      inheritedRoleIds,
      resourceId,
      resourceName,
    ),
    addAnsibleRole: bindActionCreators(AnsibleRolesSwitcherActions.addAnsibleRole, dispatch),
    removeAnsibleRole: bindActionCreators(AnsibleRolesSwitcherActions.removeAnsibleRole, dispatch),
    changeAssignedPage: bindActionCreators(
      AnsibleRolesSwitcherActions.changeAssignedPage,
      dispatch,
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnsibleRolesSwitcher);
