import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Button } from '@patternfly/react-core';
import {
  installRole,
  showErrorToast,
  showSuccessToast,
} from '../VcsCloneModalContentHelpers';

export const ModalConfirmButton = props => {
  /**
   * To be called when all the inputs are verified and the repo should be cloned.
   * Called by: 'Confirm'-Button
   * Sends a request to the server, which starts a new VcsClone-Task .
   */
  const handleConfirmButton = useCallback(async () => {
    props.setIsModalButtonLoading(true);

    const installRequest = await installRole(
      props.updateExisting,
      props.smartProxyId,
      props.repoInfo.vcs_url,
      props.repoName,
      props.gitRef
    );

    if (!installRequest.ok) {
      showErrorToast(installRequest.status);
    } else {
      showSuccessToast(installRequest.result.task.id, props.originalRepoName);
    }
    props.handleModalToggle();
  }, [props]);

  return (
    <Button
      key="confirm"
      variant="primary"
      isLoading={props.isModalButtonLoading}
      isDisabled={!props.isModalButtonActive}
      onClick={handleConfirmButton}
    >
      {__('Confirm')}
    </Button>
  );
};

ModalConfirmButton.propTypes = {
  setIsModalButtonLoading: PropTypes.func,
  updateExisting: PropTypes.bool,
  smartProxyId: PropTypes.number,
  repoInfo: PropTypes.object,
  repoName: PropTypes.string,
  gitRef: PropTypes.string,
  originalRepoName: PropTypes.string,
  isModalButtonLoading: PropTypes.bool,
  isModalButtonActive: PropTypes.bool,
  handleModalToggle: PropTypes.func,
};

ModalConfirmButton.defaultProps = {
  setIsModalButtonLoading: () => {},
  updateExisting: false,
  smartProxyId: 0,
  repoInfo: {
    branches: {},
    tags: {},
    vcs_url: null,
  },
  repoName: '',
  gitRef: 'main',
  originalRepoName: '',
  isModalButtonLoading: false,
  isModalButtonActive: false,
  handleModalToggle: () => {},
};
