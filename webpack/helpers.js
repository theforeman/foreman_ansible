import { propsToCamelCase } from 'foremanReact/common/helpers';

export const deepPropsToCamelCase = obj => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepPropsToCamelCase);
  }
  const transformed = propsToCamelCase(obj);
  return Object.keys(transformed).reduce((memo, key) => {
    memo[key] = deepPropsToCamelCase(transformed[key]);
    return memo;
  }, {});
};
