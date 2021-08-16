import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, ModalVariant, Spinner } from '@patternfly/react-core';

import { translate as __ } from 'foremanReact/common/I18n';

import './ConfirmModal.scss';

const ConfirmModal = ({ onConfirm, loading, onClose, title, isOpen, text }) => {
  const actions = [
    <Button
      key="confirm"
      variant="primary"
      onClick={onConfirm}
      isDisabled={loading}
    >
      {__('Confirm')}
    </Button>,
    <Button
      key="cancel"
      variant="link"
      onClick={event => onClose()}
      isDisabled={loading}
    >
      {__('Cancel')}
    </Button>,
  ];

  if (loading) {
    actions.push(<Spinner key="spinner" size="lg" />);
  }

  return (
    <Modal
      variant={ModalVariant.medium}
      title={title}
      isOpen={isOpen}
      className="foreman-modal"
      showClose={false}
      actions={actions}
    >
      {text}
    </Modal>
  );
};

ConfirmModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

export default ConfirmModal;
