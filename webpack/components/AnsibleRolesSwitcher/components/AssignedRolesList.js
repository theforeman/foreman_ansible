import React from 'react';
import { ListView } from 'patternfly-react';
import PaginationWrapper from 'foremanReact/components/Pagination/PaginationWrapper';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import AnsibleRole from './AnsibleRole';

const AssignedRolesList = ({
  assignedRoles,
  allAssignedRoles,
  pagination,
  itemCount,
  onPaginationChange,
  onRemoveRole,
  resourceName,
}) => {
  const directlyAssignedRoles = allAssignedRoles.filter(
    role => !role.inherited
  );

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
      <div>
        {isEmpty(directlyAssignedRoles) ? (
          <input
            type="hidden"
            name={`${resourceName}[ansible_role_ids][]`}
            value=""
          />
        ) : (
          directlyAssignedRoles.map(role => (
            <input
              key={role.id}
              type="hidden"
              name={`${resourceName}[ansible_role_ids][]`}
              value={role.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

AssignedRolesList.propTypes = {
  assignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  allAssignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
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
