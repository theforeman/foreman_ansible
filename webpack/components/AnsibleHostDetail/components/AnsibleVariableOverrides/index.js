import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

import { useQuery } from '@apollo/client';
import variableOverrides from '../../../../graphql/queries/hostVariableOverrides.gql';
import AnsibleVariableOverridesTable from './AnsibleVariableOverridesTable';
import {
  useParamsToVars,
  useCurrentPagination,
} from '../../../../helpers/pageParamsHelper';

import { encodeId } from '../../../../globalIdHelper';
import './AnsibleVariableOverrides.scss';

const AnsibleVariableOverrides = ({ hostId, hostAttrs, history }) => {
  const hostGlobalId = encodeId('Host', hostId);
  const pagination = useCurrentPagination(history);

  const useFetchFn = () =>
    useQuery(variableOverrides, {
      variables: {
        id: hostGlobalId,
        match: `fqdn=${hostAttrs.name}`,
        ...useParamsToVars(history),
      },
    });

  const renameData = data => ({
    variables: data.host.ansibleVariablesWithOverrides.nodes,
    totalCount: data.host.ansibleVariablesWithOverrides.totalCount,
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
      pagination={pagination}
      history={history}
    />
  );
};

AnsibleVariableOverrides.propTypes = {
  hostId: PropTypes.number.isRequired,
  hostAttrs: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AnsibleVariableOverrides;
