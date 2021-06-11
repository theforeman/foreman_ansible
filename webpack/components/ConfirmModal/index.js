import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, ModalVariant, Spinner } from '@patternfly/react-core';

import { translate as __ } from 'foremanReact/common/I18n';

import './ConfirmModal.scss';

const ConfirmModal = props => {
  const [callMutation, { loading }] = props.prepareMutation();

  const actions = [
    <Button
      key="confirm"
      variant="primary"
      onClick={() => props.onConfirm(callMutation, props.record.id)}
      isDisabled={loading}
    >
      {__('Confirm')}
    </Button>,
    <Button
      key="cancel"
      variant="link"
      onClick={event => props.onClose()}
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
      title={props.title}
      isOpen={props.isOpen}
      className="foreman-modal"
      showClose={false}
      actions={actions}
    >
      {props.text}
    </Modal>
  );
};

ConfirmModal.propTypes = {
  prepareMutation: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  record: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

ConfirmModal.defaultProps = {
  record: null,
};

export default ConfirmModal;
