import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { translate as __ } from 'foremanReact/common/I18n';

import { Modal, ModalVariant } from '@patternfly/react-core';

import allAnsibleRolesQuery from '../../../../../graphql/queries/allAnsibleRoles.gql';
import AllRolesTable from './AllRolesTable';

import {
  useParamsToVars,
  useCurrentPagination,
} from '../../../../../helpers/pageParamsHelper';

const AllRolesModal = ({ hostGlobalId, onClose, history }) => {
  const baseModalProps = {
    ouiaId: 'modal-ansible-roles',
    variant: ModalVariant.large,
    isOpen: true,
    onClose,
    className: 'foreman-modal',
    showClose: true,
    title: __('All assigned Ansible roles'),
    disableFocusTrap: true,
    description: __(
      'This list consists of host assigned roles and group assigned roles. Group assigned roles will always be executed prior to host assigned roles'
    ),
  };

  const paginationKeys = { page: 'page', perPage: 'per_page' };

  const wrapper = child => <Modal {...baseModalProps}>{child}</Modal>;

  const loadingWrapper = child => <Modal {...baseModalProps}>{child}</Modal>;

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
      wrapper={wrapper}
      loadingWrapper={loadingWrapper}
      emptyWrapper={loadingWrapper}
      fetchFn={useFetchFn}
      renameData={renameData}
      renamedDataPath="allAnsibleRoles"
      hostGlobalId={hostGlobalId}
      emptyStateTitle={__('No Ansible roles assigned')}
      history={history}
      pagination={pagination}
    />
  );
};

AllRolesModal.propTypes = {
  hostGlobalId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default AllRolesModal;
