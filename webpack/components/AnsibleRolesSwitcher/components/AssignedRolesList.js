import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { ListView } from 'patternfly-react';

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
  unassignedRoles,
  assignedRoles,
  toDestroyRoles,
  onRemoveRole,
  onMoveRole,
  resourceName,
}) => {
  const moveValue = (dragIndex, hoverIndex) => {
    onMoveRole(orderDragged(assignedRoles, dragIndex, hoverIndex));
  };

  const allOwnRoles = roles => roles.filter(role => !role.inherited);

  const renderRole = (role, idx) =>
    role.inherited ? renderInherited(role, idx) : renderOwn(role, idx);

  const renderInherited = (role, idx) => (
    <AnsibleRole
      key={role.id}
      role={role}
      index={idx}
      icon="fa fa-minus-circle"
      onClick={onRemoveRole}
      resourceName={resourceName}
    />
  );

  const renderOwn = (role, idx) => (
    <OrderableRole
      key={role.id}
      role={role}
      index={idx}
      moveValue={moveValue}
      icon="fa fa-minus-circle"
      onClick={onRemoveRole}
      resourceName={resourceName}
    />
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <ListView>{assignedRoles.map(renderRole)}</ListView>
      <div>
        {allOwnRoles(assignedRoles)
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
  unassignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  assignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRemoveRole: PropTypes.func.isRequired,
  onMoveRole: PropTypes.func.isRequired,
  resourceName: PropTypes.string.isRequired,
  toDestroyRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AssignedRolesList;
