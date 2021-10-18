import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { translate as __ } from 'foremanReact/common/I18n';

import ansibleRolesQuery from '../../../../graphql/queries/hostAnsibleRoles.gql';
import { encodeId } from '../../../../globalIdHelper';
import RolesTable from './RolesTable';
import {
  useParamsToVars,
  useCurrentPagination,
} from '../../../../helpers/pageParamsHelper';

const RolesTab = ({ hostId, history }) => {
  const hostGlobalId = encodeId('Host', hostId);
  const pagination = useCurrentPagination(history);

  const renameData = data => ({
    ansibleRoles: data.host.ownAnsibleRoles.nodes,
    totalCount: data.host.ownAnsibleRoles.totalCount,
  });

  const useFetchFn = () =>
    useQuery(ansibleRolesQuery, {
      variables: { id: hostGlobalId, ...useParamsToVars(history) },
      fetchPolicy: 'network-only',
    });

  return (
    <RolesTable
      fetchFn={useFetchFn}
      renamedDataPath="ansibleRoles"
      renameData={renameData}
      hostId={hostId}
      hostGlobalId={hostGlobalId}
      emptyStateProps={{ title: __('No Ansible roles assigned') }}
      permissions={['view_ansible_roles']}
      history={history}
      pagination={pagination}
    />
  );
};

RolesTab.propTypes = {
  hostId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

export default RolesTab;
