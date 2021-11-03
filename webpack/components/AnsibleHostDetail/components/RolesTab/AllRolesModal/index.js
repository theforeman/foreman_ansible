import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { translate as __ } from 'foremanReact/common/I18n';

import { Modal, Button, ModalVariant } from '@patternfly/react-core';

import allAnsibleRolesQuery from '../../../../../graphql/queries/allAnsibleRoles.gql';
import AllRolesTable from './AllRolesTable';

import {
  useParamsToVars,
  useCurrentPagination,
} from '../../../../../helpers/pageParamsHelper';

const AllRolesModal = ({ hostGlobalId, onClose, history }) => {
  const baseModalProps = {
    variant: ModalVariant.large,
    isOpen: true,
    className: 'foreman-modal',
    showClose: false,
    title: __('All Ansible Roles'),
    disableFocusTrap: true,
  };

  const paginationKeys = { page: 'allPage', perPage: 'allPerPage' };

  const actions = [
    <Button variant="link" onClick={onClose} key="close">
      {__('Close')}
    </Button>,
  ];

  const wrapper = child => (
    <Modal {...baseModalProps} actions={actions}>
      {child}
    </Modal>
  );

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
      resultPath="host.allAnsibleRoles.nodes"
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
