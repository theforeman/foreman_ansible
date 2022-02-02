import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { translate as __ } from 'foremanReact/common/I18n';

import allAnsibleRolesQuery from '../../../../../graphql/queries/allAnsibleRoles.gql';
import {
  useParamsToVars,
  useCurrentPagination,
} from '../../../../../helpers/pageParamsHelper';

import AllRolesTable from './AllRolesTable';

const AllRoles = ({ hostGlobalId, history }) => {
  const paginationKeys = { page: 'page', perPage: 'per_page' };

  const useFetchFn = () =>
    useQuery(allAnsibleRolesQuery, {
      variables: {
        id: hostGlobalId,
        ...useParamsToVars(history, paginationKeys),
      },
      fetchPolicy: 'network-only',
    });

  const renameData = data => ({
    allAnsibleRoles: data.host.allAnsibleRoles.nodes,
    totalCount: data.host.allAnsibleRoles.totalCount,
  });

  const pagination = useCurrentPagination(history, paginationKeys);

  return (
    <AllRolesTable
      fetchFn={useFetchFn}
      renameData={renameData}
      renamedDataPath="allAnsibleRoles"
      emptyStateTitle={__('No Ansible roles assigned')}
      history={history}
      pagination={pagination}
    />
  );
};

AllRoles.propTypes = {
  hostGlobalId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default AllRoles;
