import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import classNames from 'classnames';

import { Button, Spinner } from '@patternfly/react-core';
import { TimesIcon, CheckIcon, PencilAltIcon } from '@patternfly/react-icons';

import { useDispatch } from 'react-redux';
import { translate as __ } from 'foremanReact/common/I18n';

import './EditableAction.scss';

import { decodeModelId } from '../../../../globalIdHelper';
import { dispatchToast } from './ToastHelper';
import updateAnsibleVariableOverrideMutation from '../../../../graphql/mutations/updateAnsibleVariableOverride.gql';
import { formatError, joinErrors } from './EditableActionHelper';

const EditableAction = props => {
  const dispatch = useDispatch();
  const showToast = dispatchToast(dispatch);

  const [callUpdateMutation] = useMutation(
    updateAnsibleVariableOverrideMutation,
    {
      onCompleted: data => {
        const { errors } = data.updateAnsibleVariableOverride;
        if (Array.isArray(errors) && errors.length > 0) {
          if (
            errors.length === 1 &&
            errors[0].path.join(' ') === 'attributes value'
          ) {
            props.onValidationError(errors[0].message);
          } else {
            props.toggleWorking();
            showToast({
              type: 'error',
              message: formatError(joinErrors(errors)),
            });
          }
        } else {
          props.onSubmitSuccess();
          showToast({
            type: 'success',
            message: __('Ansible variable override successfully updated.'),
          });
        }
      },
      onError: error => {
        props.toggleWorking();
        showToast({ type: 'error', message: formatError(error.message) });
      },
    }
  );

  const onSubmit = (idx, variable, state, hostId) => event => {
    if (variable.currentValue.element === 'fqdn') {
      updateOverride(variable, idx, state, hostId);
    }
  };

  const updateOverride = (variable, idx, state, hostId) => {
    const matcher = `fqdn=${variable.currentValue.elementName}`;
    const lookupValue = variable.lookupValues.nodes.find(
      item => item.match === matcher
    );
    props.toggleWorking();
    callUpdateMutation({
      variables: {
        id: lookupValue.id,
        value: state.value,
        hostId,
        ansibleVariableId: decodeModelId(variable),
      },
    });
  };

  const hasError = state => state.validation.key === 'error';

  if (
    !(
      props.variable.currentValue &&
      props.variable.currentValue.element === 'fqdn'
    )
  ) {
    return null;
  }

  return (
    <React.Fragment>
      <div>
        <div
          className={classNames({
            hideElement: !props.open,
            editableActionItem: true,
          })}
        >
          <Button
            variant="plain"
            onClick={props.onClose}
            isDisabled={props.state.working}
            aria-label="Cancel editing override button"
          >
            <TimesIcon />
          </Button>
          <Button
            variant="plain"
            onClick={onSubmit(
              props.idx,
              props.variable,
              props.state,
              props.hostId
            )}
            isDisabled={props.state.working || hasError(props.state)}
            aria-label="Submit editing override button"
          >
            <CheckIcon />
          </Button>
          <span className={!props.state.working ? 'hideElement' : ''}>
            <Spinner size="md" />
          </span>
        </div>
        <div
          className={classNames({
            hideElement: props.open,
            editableActionItem: true,
          })}
        >
          <Button
            onClick={props.onOpen}
            variant="plain"
            aria-label="Edit override button"
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
  idx: PropTypes.number.isRequired,
  hostId: PropTypes.number.isRequired,
};

export default EditableAction;
