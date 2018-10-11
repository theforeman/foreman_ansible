import React from 'react';
import { filter } from 'lodash';

import AnsibleVariablesTableRow from './AnsibleVariablesTableRow';

const AnsibleVariablesTableRows = ({ assignedRoles, resourceErrors, formObject }) =>
  assignedRoles.map(role => {
    const overrideKeys = filter(role.ansibleVariables, ansibleVar => ansibleVar.override);

    const firstKey = overrideKeys[0] || {};

    return overrideKeys.map((lookupKey) => {
      const resourceError = resourceErrors.find(error => lookupKey.id === error.lookupKeyId && Object.keys(error.errors).length > 0);

      return (
        <AnsibleVariablesTableRow
          key={lookupKey.id}
          role={role}
          lookupKey={lookupKey}
          firstKey={firstKey}
          resourceError={resourceError}
          formObject={formObject}
        />
      )}
    );
  });


export default AnsibleVariablesTableRows;
