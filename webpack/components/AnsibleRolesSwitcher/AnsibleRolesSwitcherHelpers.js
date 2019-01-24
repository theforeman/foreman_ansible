export const excludeAssignedRolesSearch = (assignedRoles) => {
  const searchString = assignedRoles.length === 0 ? '' : `id !^ (${assignedRoles.map(role => role.id).join(', ')})`;
  return ({ search: searchString });
};
