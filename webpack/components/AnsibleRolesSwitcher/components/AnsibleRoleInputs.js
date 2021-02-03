import React from 'react';
import PropTypes from 'prop-types';

const AnsibleRoleInputs = props => {
  const { role, idx, resourceName } = props;

  const fieldName = attr =>
    `${resourceName}[${resourceName}_ansible_roles_attributes][${idx}][${attr}]`;

  const attrName = modelName => `${modelName}AnsibleRoleId`;

  const idField = (
    <input
      name={fieldName('id')}
      value={role[attrName(resourceName)]}
      type="hidden"
    />
  );
  return (
    <React.Fragment>
      {role[attrName(resourceName)] ? idField : null}
      <input
        name={fieldName('ansible_role_id')}
        value={role.id}
        type="hidden"
      />
      <input name={fieldName('position')} value={idx + 1} type="hidden" />
      <input
        name={fieldName('_destroy')}
        value={!!role.destroy}
        type="hidden"
      />
    </React.Fragment>
  );
};

AnsibleRoleInputs.propTypes = {
  role: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  resourceName: PropTypes.string.isRequired,
};

export default AnsibleRoleInputs;
