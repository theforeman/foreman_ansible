export const reorderVariables = variables =>
  variables.reduce((memo, role) => {
    const vars = role?.ansibleVariablesWithOverrides?.nodes.map(variable => ({
      ...variable,
      roleName: role.name,
    }));
    return memo.concat(vars);
  }, []);
