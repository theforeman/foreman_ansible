export const excludeAssignedRolesSearch = assignedRoles => {
  const searchString =
    assignedRoles.length === 0
      ? ''
      : `id !^ (${joinIds(assignedRoles.map(role => role.id))})`;
  return { search: searchString };
};

export const rolesByIdSearch = roleIds => {
  const searchString =
    roleIds && roleIds.length > 0 ? `id ^ (${joinIds(roleIds)})` : '';
  return { search: searchString };
};

const joinIds = ids => ids.join(', ');
