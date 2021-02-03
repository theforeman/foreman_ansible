import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { ListView } from 'patternfly-react';
import PaginationWrapper from 'foremanReact/components/Pagination/PaginationWrapper';

import {
  orderable,
  orderDragged,
} from 'foremanReact/components/common/forms/OrderableSelect/helpers';

import PropTypes from 'prop-types';

import AnsibleRole from './AnsibleRole';
import AnsibleRoleInputs from './AnsibleRoleInputs';

const OrderableRole = orderable(AnsibleRole, {
  type: 'ansibleRole',
  getItem: props => ({ id: props.role.id }),
  direction: 'vertical',
});

const AssignedRolesList = ({
  assignedRoles,
  unassignedRoles,
  allAssignedRoles,
  toDestroyRoles,
  pagination,
  itemCount,
  onPaginationChange,
  onRemoveRole,
  onMoveRole,
  resourceName,
}) => {
  const moveValue = (dragIndex, hoverIndex) => {
    onMoveRole(orderDragged(allAssignedRoles, dragIndex, hoverIndex));
  };

  const roleIdx = (idx, pageInfo) =>
    idx + (pageInfo.page - 1) * pageInfo.perPage;

  const allOwnRoles = roles => roles.filter(role => !role.inherited);

  const renderRole = (role, idx) =>
    role.inherited ? renderInherited(role) : renderOwn(role, idx);

  const renderInherited = role => (
    <AnsibleRole
      key={role.id}
      role={role}
      icon="fa fa-minus-circle"
      onClick={onRemoveRole}
      resourceName={resourceName}
    />
  );

  const renderOwn = (role, idx) => (
    <OrderableRole
      key={role.id}
      role={role}
      index={roleIdx(idx, pagination)}
      moveValue={moveValue}
      icon="fa fa-minus-circle"
      onClick={onRemoveRole}
      resourceName={resourceName}
    />
  );

  return (
    <DndProvider backend={HTML5Backend}>
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
        {allAssignedRoles.map(renderRole)}
      </ListView>
      <div>
        {allOwnRoles(allAssignedRoles)
          .concat(toDestroyRoles)
          .map((role, idx) => (
            <AnsibleRoleInputs
              key={role.id}
              role={role}
              idx={idx}
              resourceName={resourceName}
            />
          ))}
      </div>
    </DndProvider>
  );
};

AssignedRolesList.propTypes = {
  assignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  unassignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  allAssignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
  itemCount: PropTypes.number.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
  onRemoveRole: PropTypes.func.isRequired,
  onMoveRole: PropTypes.func.isRequired,
  resourceName: PropTypes.string.isRequired,
  toDestroyRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AssignedRolesList;
