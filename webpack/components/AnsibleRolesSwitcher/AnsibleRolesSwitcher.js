import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Alert } from 'patternfly-react';
import { isEmpty } from 'lodash';

import AvailableRolesList from './AvailableRolesList';
import AssignedRolesList from './AssignedRolesList';

const excludeAssignedRolesSearch = assignedRoles =>
  ({ search: `id !^ (${assignedRoles.map(role => role.id).join(', ')})` });

class AnsibleRolesSwitcher extends React.Component {
  componentDidMount() {
    this.props.getAnsibleRoles({}, excludeAssignedRolesSearch(this.props.initialAssignedRoles));
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
      resourceName,
      error,
    } = this.props;

    const onListingChange = args =>
      getAnsibleRoles(args, excludeAssignedRolesSearch(assignedRoles));

    const errorMsg = (err) => {
      const status = err.statusText ? `${err.statusText}: ` : '';
      return `${status}${err.errorMsg}`;
    };

    const showError = err => (
      isEmpty(err.errorMsg) ? '' : (
        <Col sm={12} >
          <Alert type='error'>
            { errorMsg(error) }
          </Alert>
        </Col>
      ));

    return (
      <Grid bsClass="container-fluid" id="ansibleRolesSwitcher">
          <Row className="row-eq-height">
            { showError(error) }
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
                                    resourceName={resourceName} />
            </Col>
          </Row>
      </Grid>
    );
  }
}

export default AnsibleRolesSwitcher;
