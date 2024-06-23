import React from 'react';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { showToast } from '../../toastHelper';
import { DuplicateStatus } from './YamlVariablesImporterConstants';

const installedVariables = {};

export const yamlToJson = async b64String => {
  const response = await fetch('api/v2/ansible_variables/import/yaml_to_json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: b64String, readonly: true }),
  });

  if (response.ok) {
    return {
      code: response.status,
      response: await response.json(),
    };
  }
  showErrorToast('convertYaml', response.status);
  return null;
};

export const getInstalledRoles = async () => {
  const response = await fetch('api/v2/ansible_roles?per_page=all', {
    // Max Entries = 50
    method: 'GET',
  });
  if (response.ok) {
    const responseJson = await response.json();
    return {
      code: response.status,
      response: responseJson.results.map(role => role.name),
    };
  }
  showErrorToast('requestRoles', response.status);
  return null;
};

export const installFrom = async (method, data) => {
  const response = await fetch(
    `api/v2/ansible_variables/import/from_${method}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        method === 'yaml' ? { data, readonly: false } : { data }
      ),
    }
  );
  if (response.ok) {
    showSuccessToast(countAll(data));
  } else {
    showErrorToast('requestRoles', response.status);
  }
  return {
    code: response.status,
    response: {},
  };
};

export const sha256 = async fileString => {
  const msgUint8 = new TextEncoder().encode(fileString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const duplicatesInstalled = async (roleName, variableName) => {
  if (!installedVariables.hasOwnProperty(roleName)) {
    const response = await fetch(
      `api/v2/ansible_variables?search=ansible_role=${roleName}&per_page=all`,
      {
        method: 'GET',
      }
    );
    if (response.ok) {
      const variables = await response.json();
      installedVariables[roleName] = new Map(
        variables.results.map(item => [item.parameter, null])
      );
    } else {
      showErrorToast(`requestInstalledRolesFor${roleName}`, response.status);
      return false;
    }
  }
  return installedVariables[roleName].has(variableName);
};

export const duplicatesLocal = (allVariables, variableName) =>
  allVariables.filter(variable => variable.name === variableName);

const countAll = data => {
  let count = 0;
  // eslint-disable-next-line no-unused-vars
  Object.keys(data).forEach(role => {
    count += Object.keys(data[role]).length;
  });
  return count;
};

export const evaluateTree = abstractTree => {
  const rTree = {};

  // eslint-disable-next-line no-unused-vars
  for (const role of abstractTree) {
    const roleName = role.assign_to;
    const vTree = {};
    // eslint-disable-next-line no-unused-vars
    for (const variable of role.variables) {
      if (variable.checked) {
        vTree[variable.name] = { value: variable.default, type: variable.type };
      }
    }
    if (!(Object.keys(vTree).length === 0)) {
      rTree[roleName] = { ...rTree[roleName], ...vTree };
    }
  }
  return rTree;
};

export const treeify = (jsonified, internalId, hash, defaultRole) => {
  const variables = [];

  // eslint-disable-next-line no-unused-vars
  for (const variableName of Object.keys(jsonified)) {
    const variable = jsonified[variableName];
    variables.push({
      name: variableName,
      checked: true,
      default: variable.value,
      type: variable.type,
      isDuplicate: DuplicateStatus.NO_DUPLICATE,
    });
  }
  return {
    internal_id: internalId,
    hash,
    assign_to: defaultRole,
    count: variables.length,
    variables,
  };
};

export const fileInTree = (tree, file) => {
  // eslint-disable-next-line no-unused-vars
  for (const fileObj of tree) {
    if (fileObj.hash === file.hash) {
      return true;
    }
  }
  return false;
};
export const showSuccessToast = count => {
  showToast({
    type: 'success',
    message: (
      <span>
        {sprintf(__('Successfully imported %(count)s variables!'), {
          count,
        })}
      </span>
    ),
  });
};

export const showErrorToast = (job, errorCode) => {
  showToast({
    type: 'danger',
    message: (
      <span>
        {sprintf(__('Error: %(job)s failed with code %(errorCode)s'), {
          job,
          errorCode,
        })}
      </span>
    ),
  });
};
