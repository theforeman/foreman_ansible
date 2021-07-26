import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { translate as __ } from 'foremanReact/common/I18n';

import { Modal, Button, ModalVariant } from '@patternfly/react-core';

import allAnsibleRolesQuery from '../../../../../graphql/queries/allAnsibleRoles.gql';
import AllRolesTable from './AllRolesTable';

const AllRolesModal = ({ hostGlobalId, onClose }) => {
  const baseModalProps = {
    variant: ModalVariant.large,
    isOpen: true,
    className: 'foreman-modal',
    showClose: false,
    title: __('All Ansible Roles'),
    disableFocusTrap: true,
  };

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
      variables: { id: hostGlobalId },
      fetchPolicy: 'network-only',
    });

  const renameData = data => ({
    allAnsibleRoles: data.host.allAnsibleRoles.nodes,
  });

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
    />
  );
};

AllRolesModal.propTypes = {
  hostGlobalId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AllRolesModal;
