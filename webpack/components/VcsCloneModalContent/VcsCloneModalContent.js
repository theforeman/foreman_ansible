import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Grid,
  GridItem,
  Alert,
  Popover,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { GitLinkInputComponent } from './components/GitLinkInputComponent';
import { BranchTagSelectionMenu } from './components/BranchTagSelectionMenu';
import { SmartProxySelector } from './components/SmartProxySelector';
import { ModalConfirmButton } from './components/ModalConfirmButton';
import { fetchSmartProxies } from './VcsCloneModalContentHelpers';
import { RoleNameInput } from './components/RoleNameInput';
import { UpdateExistingSwitch } from './components/UpdateExistingSwitch';

export const VcsCloneModalContent = () => {
  const [gitRef, setGitRef] = useState('main');
  const [installedRoles, setInstalledRoles] = useState({});
  const [repoName, setRepoName] = useState('');
  const [isModalButtonLoading, setIsModalButtonLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repoInfo, setRepoInfo] = useState({
    branches: {},
    tags: {},
    vcs_url: null,
  });
  const [branchTagsEnabled, setBranchTagsEnabled] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [originalRepoName, setOriginalRepoName] = useState('');
  const [smartProxies, setSmartProxies] = useState({});
  const [smartProxySelection, setSmartProxySelection] = useState([]);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);
  const [isModalButtonActive, setIsModalButtonActive] = useState(false);

  // EFFECT-HANDLERS

  /**
   * Watch URL-anchor and open/close modal.
   */
  useEffect(() => {
    // Handle direct link ...#vcs_import
    if (window.location.hash === '#vcs_download') {
      handleModalToggle();
    }
    // Set event listener for anchor change
    onhashchange = () => {
      if (window.location.hash === '#vcs_download') {
        handleModalToggle();
      }
    };
  }, [handleModalToggle]);

  /**
   * Fetch SmartProxies when the modal is opened.
   */
  useEffect(() => {
    async function request() {
      if (isModalOpen) {
        const smartProxiesRequest = await fetchSmartProxies();
        if (
          Object.keys(smartProxiesRequest.proxies).length === 0 ||
          !smartProxiesRequest.ok
        ) {
          setAlertText(
            __('No smartproxies with support for cloning from Git found')
          );
          setIsErrorState(true);
        } else {
          setSmartProxies(smartProxiesRequest.proxies);
        }
      }
    }

    // eslint-disable-next-line no-unused-vars
    const ignored = request();
  }, [isModalOpen]);

  useEffect(() => {
    setIsModalButtonActive(
      !isErrorState &&
        repoName !== '' &&
        smartProxySelection.length !== 0 &&
        gitRef !== ''
    );
  }, [isErrorState, repoName, gitRef, smartProxySelection.length]);

  /**
   * Method to check whether a role is already present on the selected SmartProxy.
   * Called when one of the deps is updated
   * Checks whether 'Repo name' is a role that is already present on the selected SmartProxy.
   * -> Shows the alert if a collision is present.
   */
  useEffect(() => {
    setIsErrorState(false);
    if (smartProxySelection.length !== 0) {
      // eslint-disable-next-line no-unused-vars
      for (const [_, proxyId] of Object.entries(smartProxies)) {
        const roles = installedRoles[proxyId];

        if (roles !== undefined) {
          if (roles.has(repoName) && !updateExisting) {
            setAlertText(
              sprintf(
                __(
                  'A repository with the name %(rName)s is already present on %(pName)s'
                ),
                {
                  rName: repoName,
                  pName: Object.keys(smartProxies).filter(
                    key => smartProxies[key] === proxyId
                  ),
                }
              )
            );
            setIsErrorState(true);
          }
        }
      }
    }
  }, [
    smartProxySelection,
    repoName,
    smartProxies,
    installedRoles,
    updateExisting,
  ]);

  // CALLBACKS

  /**
   * To be called when the modal is to be opened or closed.
   * Called by: 'Cancel'- and 'x'-button
   * Resets all the states and toggles modal visibility.
   */
  const handleModalToggle = useCallback(() => {
    if (isModalOpen) {
      setGitRef('main');
      setInstalledRoles({});
      setRepoName('');
      setIsModalButtonLoading(false);
      setIsModalButtonActive(false);
      setIsModalOpen(false);
      setRepoInfo({
        branches: {},
        tags: {},
        vcs_url: null,
      });
      setIsErrorState(false);
      setAlertText('');
      setOriginalRepoName('');
      setSmartProxies({});
      setSmartProxySelection([]);
      setUpdateExisting(false);
      setBranchTagsEnabled(false);
      window.location.hash = '';
    }
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  return (
    <React.Fragment>
      <Modal
        variant={ModalVariant.medium}
        title={__('Download Ansible roles from Git')}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <ModalConfirmButton
            setIsModalButtonLoading={setIsModalButtonLoading}
            updateExisting={updateExisting}
            smartProxyId={smartProxies[smartProxySelection]}
            repoInfo={repoInfo}
            repoName={repoName}
            gitRef={gitRef}
            originalRepoName={originalRepoName}
            isModalButtonLoading={isModalButtonLoading}
            isModalButtonActive={isModalButtonActive}
            handleModalToggle={handleModalToggle}
          />,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            {__('Cancel')}
          </Button>,
        ]}
        help={
          <Popover bodyContent={<div>TODO: Link to Foreman doc</div>}>
            <Button variant="plain" aria-label="Help">
              <HelpIcon />
            </Button>
          </Popover>
        }
      >
        <Grid hasGutter>
          <GridItem hidden={!isErrorState}>
            <Alert variant="danger" title={alertText} isInline />
          </GridItem>
          <GridItem>
            <GitLinkInputComponent
              setRepoName={setRepoName}
              setOriginalRepoName={setOriginalRepoName}
              smartProxies={smartProxies}
              smartProxySelection={smartProxySelection}
              setAlertText={setAlertText}
              setIsErrorState={setIsErrorState}
              setRepoInfo={setRepoInfo}
              repoInfo={repoInfo}
              setBranchTagsEnabled={setBranchTagsEnabled}
            />
          </GridItem>
          <GridItem>
            <BranchTagSelectionMenu
              repoInfo={repoInfo}
              gitRef={gitRef}
              setGitRef={setGitRef}
              branchTagsEnabled={branchTagsEnabled}
            />
          </GridItem>
          <GridItem>
            <SmartProxySelector
              smartProxies={smartProxies}
              smartProxySelection={smartProxySelection}
              setSmartProxySelection={setSmartProxySelection}
              installedRoles={installedRoles}
              setInstalledRoles={setInstalledRoles}
            />
          </GridItem>
          <GridItem>
            <RoleNameInput repoName={repoName} setRepoName={setRepoName} />
          </GridItem>
          <GridItem>
            <UpdateExistingSwitch
              updateExisting={updateExisting}
              setUpdateExisting={setUpdateExisting}
            />
          </GridItem>
        </Grid>
      </Modal>
    </React.Fragment>
  );
};
