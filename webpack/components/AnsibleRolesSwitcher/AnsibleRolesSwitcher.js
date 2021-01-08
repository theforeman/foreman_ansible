import React from 'react';
import { Grid, Row, Col } from 'patternfly-react';
import { lowerCase } from 'lodash';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

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
    } = this.props;

    this.props.getAnsibleRoles(
      availableRolesUrl,
      initialAssignedRoles,
      inheritedRoleIds,
      resourceId,
      resourceName,
      { page: 1, perPage: 10 },
      excludeAssignedRolesSearch(initialAssignedRoles)
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
      allAssignedRoles,
      unassignedRoles,
      error,
    } = this.props;

    const {
      availableRolesUrl,
      inheritedRoleIds,
      resourceId,
      resourceName,
    } = this.props;

    const onListingChange = paginationArgs =>
      getAnsibleRoles(
        availableRolesUrl,
        allAssignedRoles,
        inheritedRoleIds,
        resourceId,
        resourceName,
        paginationArgs,
        excludeAssignedRolesSearch(allAssignedRoles)
      );

    return (
      <Grid bsClass="container-fluid" id="ansibleRolesSwitcher">
        <Row className="row-eq-height">
          <AnsibleRolesSwitcherError error={error} />
          <Col sm={6} className="available-roles-container">
            <div className="available-roles-header">
              <h2>{__('Available Ansible Roles')}</h2>
            </div>
            <AvailableRolesList
              unassignedRoles={unassignedRoles}
              pagination={pagination}
              itemCount={itemCount}
              onListingChange={onListingChange}
              onAddRole={addAnsibleRole}
              loading={loading}
            />
          </Col>

          <Col sm={6} className="assigned-roles-container">
            <div className="assigned-roles-header">
              <h2>{__('Assigned Ansible Roles')}</h2>
            </div>
            <AssignedRolesList
              assignedRoles={assignedRoles}
              allAssignedRoles={allAssignedRoles}
              pagination={assignedPagination}
              itemCount={assignedRolesCount}
              onPaginationChange={changeAssignedPage}
              onRemoveRole={removeAnsibleRole}
              resourceName={lowerCase(resourceName || '')}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

AnsibleRolesSwitcher.propTypes = {
  initialAssignedRoles: PropTypes.arrayOf(PropTypes.object),
  availableRolesUrl: PropTypes.string.isRequired,
  inheritedRoleIds: PropTypes.arrayOf(PropTypes.number),
  resourceId: PropTypes.number,
  resourceName: PropTypes.string,
  getAnsibleRoles: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
  itemCount: PropTypes.number.isRequired,
  addAnsibleRole: PropTypes.func.isRequired,
  removeAnsibleRole: PropTypes.func.isRequired,
  changeAssignedPage: PropTypes.func.isRequired,
  assignedPagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
  assignedRolesCount: PropTypes.number.isRequired,
  assignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  allAssignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  unassignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  error: PropTypes.shape({
    errorMsg: PropTypes.string,
    statusText: PropTypes.string,
  }),
};

AnsibleRolesSwitcher.defaultProps = {
  error: {},
  resourceId: null,
  resourceName: '',
  initialAssignedRoles: [],
  inheritedRoleIds: [],
};

export default AnsibleRolesSwitcher;
