import React, { useState, useEffect } from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/client';

import {
  Button,
  DualListSelector,
  Modal,
  Spinner,
} from '@patternfly/react-core';
import { encodeId } from '../../../../../globalIdHelper';
import assignAnsibleRoles from '../../../../../graphql/mutations/assignAnsibleRoles.gql';
import { onCompleted, onError, roleNamesToIds } from './EditRolesModalHelper';
import withLoading from '../../../../withLoading';

const EditRolesForm = props => {
  const {
    assignedRoles,
    availableRoles,
    closeModal,
    hostId,
    baseModalProps,
    actions,
  } = props;

  const [chosenState, setChosenState] = useState({
    availableOptions: [],
    chosenOptions: [],
  });

  useEffect(() => {
    setChosenState({
      availableOptions: availableRoles.map(item => item.name),
      chosenOptions: assignedRoles.map(item => item.name) || [],
    });
  }, [availableRoles, assignedRoles]);

  const [callMutation, { loading }] = useMutation(assignAnsibleRoles, {
    onCompleted: onCompleted(closeModal),
    onError,
  });

  const allRoles = (availableRoles || []).concat(assignedRoles || []);

  const variables = {
    id: encodeId('Host', hostId),
    ansibleRoleIds: roleNamesToIds(allRoles, chosenState.chosenOptions),
  };

  const formActions = [
    <Button
      key="confirm"
      variant="primary"
      onClick={() => callMutation({ variables })}
      isDisabled={loading}
      aria-label="submit ansible roles"
    >
      {__('Confirm')}
    </Button>,
    ...actions,
  ];

  if (loading) {
    formActions.push(<Spinner key="spinner" size="lg" />);
  }

  return (
    <Modal {...baseModalProps} actions={formActions}>
      <DualListSelector
        availableOptions={chosenState.availableOptions}
        chosenOptions={chosenState.chosenOptions}
        onListChange={(newAvailable, newChosen) =>
          setChosenState({
            availableOptions: newAvailable,
            chosenOptions: newChosen,
          })
        }
      />
    </Modal>
  );
};

EditRolesForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  assignedRoles: PropTypes.array.isRequired,
  availableRoles: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  hostId: PropTypes.number.isRequired,
  baseModalProps: PropTypes.object.isRequired,
};

export default withLoading(EditRolesForm);
