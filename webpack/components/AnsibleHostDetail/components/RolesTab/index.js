import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { translate as __ } from 'foremanReact/common/I18n';

import ansibleRolesQuery from '../../../../graphql/queries/ansibleRoles.gql';
import RolesTable from './RolesTable';

const RolesTab = props => {
  const renameData = data => ({
    ansibleRoles: data.ansibleRoles.nodes,
  });

  const useFetchFn = () =>
    useQuery(ansibleRolesQuery, {
      variables: { search: `host_id = ${props.hostId}` },
    });

  return (
    <RolesTable
      fetchFn={useFetchFn}
      resultPath="ansibleRoles.nodes"
      renameData={renameData}
      emptyStateTitle={__('No Ansible roles assigned')}
    />
  );
};

RolesTab.propTypes = {
  hostId: PropTypes.number.isRequired,
};

export default RolesTab;
