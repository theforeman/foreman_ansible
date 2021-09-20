import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { translate as __ } from 'foremanReact/common/I18n';

import ansibleRolesQuery from '../../../../graphql/queries/hostAnsibleRoles.gql';
import { encodeId } from '../../../../globalIdHelper';
import RolesTable from './RolesTable';

const RolesTab = ({ hostId, history }) => {
  const renameData = data => ({
    ansibleRoles: data.host.ownAnsibleRoles.nodes,
  });

  const useFetchFn = () =>
    useQuery(ansibleRolesQuery, {
      variables: { id: encodeId('Host', hostId) },
    });

  return (
    <RolesTable
      fetchFn={useFetchFn}
      resultPath="host.ownAnsibleRoles.nodes"
      renameData={renameData}
      emptyStateTitle={__('No Ansible roles assigned')}
      hostId={hostId}
      history={history}
    />
  );
};

RolesTab.propTypes = {
  hostId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

export default RolesTab;
