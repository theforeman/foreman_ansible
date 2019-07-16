import React from 'react';
import { ListView } from 'patternfly-react';
import PaginationWrapper from 'foremanReact/components/Pagination/PaginationWrapper';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import AnsibleRole from './AnsibleRole';

const AssignedRolesList = ({
  assignedRoles,
  pagination,
  itemCount,
  onPaginationChange,
  onRemoveRole,
  resourceName,
}) => {
  const directlyAssignedRoles = assignedRoles.filter(role => !role.inherited);

  const inputFields = (directlyAssignedRoles, resourceName) => {
    let result;
    if (isEmpty(directlyAssignedRoles)) {
       result = <input type="hidden" name={`${resourceName}[ansible_role_ids][]`} value=""/>
    } else {
      result = directlyAssignedRoles.map(role => (
        <input
          key={role.id}
          type="hidden"
          name={`${resourceName}[ansible_role_ids][]`}
          value={role.id}
        />
      ))
    }

    return (
      <div>
        { result }
      </div>
    );
  }

  return (
    <div>
      <ListView>
        <div className="sticky-pagination sticky-pagination-grey">
          <PaginationWrapper
            viewType="list"
            itemCount={itemCount}
            pagination={pagination}
            onChange={onPaginationChange}
            dropdownButtonId="assigned-ansible-roles-pagination-row-dropdown"
          />
        </div>
        {assignedRoles.map(role => (
          <AnsibleRole
            key={role.id}
            role={role}
            icon="fa fa-minus-circle"
            onClick={onRemoveRole}
            resourceName={resourceName}
          />
        ))}
      </ListView>
      { inputFields(directlyAssignedRoles, resourceName) }
    </div>
  );
};

AssignedRolesList.propTypes = {
  assignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
  itemCount: PropTypes.number.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
  onRemoveRole: PropTypes.func.isRequired,
  resourceName: PropTypes.string.isRequired,
};

export default AssignedRolesList;
