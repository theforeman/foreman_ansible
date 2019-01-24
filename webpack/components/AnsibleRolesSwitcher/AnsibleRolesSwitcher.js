import React from 'react';
import { Grid, Row, Col } from 'patternfly-react';
import { lowerCase } from 'lodash';

import AvailableRolesList from './components/AvailableRolesList';
import AssignedRolesList from './components/AssignedRolesList';
import AnsibleRolesSwitcherError from './components/AnsibleRolesSwitcherError';
import { excludeAssignedRolesSearch } from './AnsibleRolesSwitcherHelpers';

class AnsibleRolesSwitcher extends React.Component {
  componentDidMount() {
    const {
      initialAssignedRoles,
      availableRolesUrl,
      inheritedRoleIds,
      resourceId,
      resourceName,
    } = this.props.data;

    this.props.getAnsibleRoles(
      availableRolesUrl,
      initialAssignedRoles,
      inheritedRoleIds,
      resourceId,
      resourceName,
      {},
      excludeAssignedRolesSearch(initialAssignedRoles),
    );
  }

  render() {
    const {
      loading,
      pagination,
      itemCount,
      addAnsibleRole,
      removeAnsibleRole,
      getAnsibleRoles,
      changeAssignedPage,
      assignedPagination,
      assignedRolesCount,
      assignedRoles,
      unassignedRoles,
      error,
    } = this.props;

    const {
      availableRolesUrl,
      inheritedRoleIds,
      resourceId,
      resourceName,
    } = this.props.data;

    const onListingChange = paginationArgs =>
      getAnsibleRoles(
        availableRolesUrl,
        assignedRoles,
        inheritedRoleIds,
        resourceId,
        resourceName,
        paginationArgs,
        excludeAssignedRolesSearch(assignedRoles),
      );

    return (
      <Grid bsClass="container-fluid" id="ansibleRolesSwitcher">
          <Row className="row-eq-height">
            <AnsibleRolesSwitcherError error={error} />
            <Col sm={6} className="available-roles-container">
              <div className="available-roles-header">
                <h2>{__('Available Ansible Roles')}</h2>
              </div>
               <AvailableRolesList unassignedRoles={unassignedRoles}
                                   pagination={pagination}
                                   itemCount={itemCount}
                                   onListingChange={onListingChange}
                                   onAddRole={addAnsibleRole}
                                   loading={loading} />
            </Col>

            <Col sm={6} className="assigned-roles-container">
              <div className="assigned-roles-header">
                <h2>{__('Assigned Ansible Roles')}</h2>
              </div>
                 <AssignedRolesList assignedRoles={assignedRoles}
                                    pagination={assignedPagination}
                                    itemCount={assignedRolesCount}
                                    onPaginationChange={changeAssignedPage}
                                    onRemoveRole={removeAnsibleRole}
                                    resourceName={lowerCase(resourceName || '')} />
            </Col>
          </Row>
      </Grid>
    );
  }
}

export default AnsibleRolesSwitcher;
