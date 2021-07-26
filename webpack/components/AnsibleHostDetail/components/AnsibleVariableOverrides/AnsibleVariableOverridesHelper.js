export const reorderVariables = variables =>
  variables.reduce((memo, role) => {
    const vars = role?.ansibleVariablesWithOverrides?.nodes;
    if (vars) {
      return memo.concat(vars);
    }
    return memo;
  }, []);
