import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

import { useQuery } from '@apollo/client';
import variableOverrides from '../../../../graphql/queries/variableOverrides.gql';
import AnsibleVariableOverridesTable from './AnsibleVariableOverridesTable';

import { encodeId } from '../../../../globalIdHelper';
import { extractVariables } from './AnsibleVariableOverridesHelper';
import './AnsibleVariableOverrides.scss';

const AnsibleVariableOverrides = ({ hostId, hostAttrs }) => {
  const hostGlobalId = encodeId('Host', hostId);

  const useFetchFn = () =>
    useQuery(variableOverrides, {
      variables: { hostId, id: hostGlobalId, match: `fqdn=${hostAttrs.name}` },
    });

  const renameData = data => ({
    variables: extractVariables(data.host.allAnsibleRoles.nodes),
  });

  return (
    <AnsibleVariableOverridesTable
      hostId={hostId}
      hostAttrs={hostAttrs}
      hostGlobalId={hostGlobalId}
      renameData={renameData}
      fetchFn={useFetchFn}
      renamedDataPath="variables"
      emptyStateTitle={__('No Ansible Variables found for Host')}
      permissions={['view_ansible_variables']}
    />
  );
};

AnsibleVariableOverrides.propTypes = {
  hostId: PropTypes.number.isRequired,
  hostAttrs: PropTypes.object.isRequired,
};

export default AnsibleVariableOverrides;
