import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import classNames from 'classnames';

import { Button, Spinner } from '@patternfly/react-core';
import { TimesIcon, CheckIcon, PencilAltIcon } from '@patternfly/react-icons';

import './EditableAction.scss';

import { decodeModelId } from '../../../../globalIdHelper';
import updateAnsibleVariableOverrideMutation from '../../../../graphql/mutations/updateAnsibleVariableOverride.gql';
import createAnsibleVariableOverrideMutation from '../../../../graphql/mutations/createAnsibleVariableOverride.gql';
import {
  onCompleted,
  onError,
  hasError,
  createMatcher,
} from './EditableActionHelper';

const EditableAction = ({
  onValidationError,
  toggleWorking,
  onSubmitSuccess,
  open,
  onClose,
  onOpen,
  state,
  variable,
  hostId,
  hostName,
}) => {
  const [callUpdateMutation] = useMutation(
    updateAnsibleVariableOverrideMutation,
    {
      onCompleted: onCompleted(
        'updateAnsibleVariableOverride',
        onValidationError,
        toggleWorking,
        onSubmitSuccess
      ),
      onError: onError(toggleWorking),
    }
  );

  const [callCreateMutation] = useMutation(
    createAnsibleVariableOverrideMutation,
    {
      onCompleted: onCompleted(
        'createAnsibleVariableOverride',
        onValidationError,
        toggleWorking,
        onSubmitSuccess
      ),
      onError: onError(toggleWorking),
    }
  );

  const onSubmit = event => {
    if (!variable.currentValue || variable.currentValue.element !== 'fqdn') {
      return createOverride();
    }
    return updateOverride();
  };

  const updateOverride = () => {
    const match = createMatcher(variable.currentValue.elementName);
    const lookupValue = variable.lookupValues.nodes.find(
      item => item.match === match
    );
    toggleWorking(true);
    callUpdateMutation({
      variables: {
        id: lookupValue.id,
        value: state.value,
        hiddenValue: state.hiddenValue,
        hostId,
        ansibleVariableId: decodeModelId(variable),
        match,
      },
    });
  };

  const createOverride = () => {
    const match = createMatcher(hostName);
    toggleWorking(true);
    callCreateMutation({
      variables: {
        hostId,
        lookupKeyId: decodeModelId(variable),
        value: state.value,
        match,
      },
    });
  };

  if (!variable.meta.canEdit) {
    return null;
  }

  return (
    <React.Fragment>
      <div>
        <div
          className={classNames({
            hideElement: !open,
            editableActionItem: true,
          })}
        >
          <Button
            variant="plain"
            onClick={onClose}
            isDisabled={state.working}
            aria-label="Cancel editing override button"
            ouiaId="cancel-editing-override-button"
          >
            <TimesIcon />
          </Button>
          <Button
            variant="plain"
            onClick={onSubmit}
            isDisabled={state.working || hasError(state)}
            aria-label="Submit editing override button"
            ouiaId="submit-editing-override-button"
          >
            <CheckIcon />
          </Button>
          <span className={!state.working ? 'hideElement' : ''}>
            <Spinner size="md" />
          </span>
        </div>
        <div
          className={classNames({
            hideElement: open,
            editableActionItem: true,
          })}
        >
          <Button
            onClick={onOpen}
            variant="plain"
            aria-label="Edit override button"
            ouiaId="edit-override-button"
          >
            <PencilAltIcon />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

EditableAction.propTypes = {
  onValidationError: PropTypes.func.isRequired,
  toggleWorking: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  variable: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  hostId: PropTypes.number.isRequired,
  hostName: PropTypes.string.isRequired,
};

export default EditableAction;
