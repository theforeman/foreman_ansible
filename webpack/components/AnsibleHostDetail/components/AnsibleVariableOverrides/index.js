import React, { useState } from 'react';
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
  const [totalItems, setTotalItems] = useState(0);

  const useFetchFn = () =>
    useQuery(variableOverrides, {
      variables: {
        id: hostGlobalId,
        match: `fqdn=${hostAttrs.name}`,
        ...useParamsToVars(history, totalItems),
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
    });

  const renameData = data => {
    const totalCount = data.host.ansibleVariablesWithOverrides.totalCount;
    if (totalItems === 0) setTotalItems(totalCount);
    return ({
      variables: data.host.ansibleVariablesWithOverrides.nodes,
      totalCount,
    })
  };

  return (
    <AnsibleVariableOverridesTable
      hostId={hostId}
      hostAttrs={hostAttrs}
      hostGlobalId={hostGlobalId}
      renameData={renameData}
      fetchFn={useFetchFn}
      renamedDataPath="variables"
      emptyStateProps={{
        header: __('No Ansible variables found for Host'),
        description: __('Only variables marked to Override are shown here.'),
      }}
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
