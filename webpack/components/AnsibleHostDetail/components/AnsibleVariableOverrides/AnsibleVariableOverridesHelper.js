export const extractVariables = roles =>
  roles.flatMap(role => role.ansibleVariablesWithOverrides.nodes);
