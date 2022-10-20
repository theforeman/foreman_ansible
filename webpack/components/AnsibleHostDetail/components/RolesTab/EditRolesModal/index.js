import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';

import { Modal, Button } from '@patternfly/react-core';
import { useQuery } from '@apollo/client';

import EditRolesForm from './EditRolesForm';

import availableAnsibleRoles from '../../../../../graphql/queries/hostAvailableAnsibleRoles.gql';
import { encodeId } from '../../../../../globalIdHelper';

import './EditRolesModal.scss';

const EditRolesModal = ({
  assignedRoles,
  isOpen,
  closeModal,
  hostId,
  canEditHost,
}) => {
  const baseModalProps = {
    ouiaId: 'edit-ansible-roles-modal',
    width: '50%',
    isOpen,
    className: 'foreman-modal',
    showClose: false,
    title: __('Edit Ansible Roles'),
    disableFocusTrap: true,
    description: __(
      'Add, remove or reorder host assigned Ansible roles. This host has also group assigned roles that are not displayed here and will always be executed prior to host assigned roles.'
    ),
  };

  const actions = [
    <Button
      ouiaId="close-button"
      variant="link"
      onClick={event => closeModal()}
      key="close"
    >
      {__('Close')}
    </Button>,
  ];

  const emptyWrapper = child => (
    <Modal {...baseModalProps} actions={actions}>
      {child}
    </Modal>
  );

  const loadingWrapper = child => <Modal {...baseModalProps}>{child}</Modal>;

  const variables = {
    id: encodeId('Host', hostId),
  };

  const useFetchFn = () =>
    useQuery(availableAnsibleRoles, { variables, fetchPolicy: 'network-only' });

  const renameData = data => ({
    availableRoles: data.host.availableAnsibleRoles.nodes,
    assignedRoles,
  });

  return (
    <EditRolesForm
      emptyWrapper={emptyWrapper}
      loadingWrapper={loadingWrapper}
      actions={actions}
      baseModalProps={baseModalProps}
      fetchFn={useFetchFn}
      renameData={renameData}
      renamedDataPath="availableRoles.assignedRoles"
      assignedRoles={assignedRoles}
      closeModal={closeModal}
      hostId={hostId}
      allowed={canEditHost}
      requiredPermissions={['edit_hosts']}
    />
  );
};

EditRolesModal.propTypes = {
  assignedRoles: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  hostId: PropTypes.number.isRequired,
  canEditHost: PropTypes.bool.isRequired,
};

export default EditRolesModal;
