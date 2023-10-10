import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Button,
  InputGroup,
  TextInput,
  Form,
  FormGroup,
  Popover,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { getRepoInfo } from '../VcsCloneModalContentHelpers';

export const GitLinkInputComponent = props => {
  const [isButtonActive, setButtonActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [validated, setValidated] = useState('default');
  const [invalidText, setInvalidText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFirstRender = useRef(true);

  const primaryLoadingProps = {};
  primaryLoadingProps.spinnerAriaValueText = 'Loading';
  primaryLoadingProps.spinnerAriaLabelledBy = 'primary-loading-button';
  primaryLoadingProps.isLoading = isLoading;

  /**
   * To be called when Repo-information is to be requested.
   * Called by: 'Examine'-Button
   * Sends a request to the server, which responds with information about the provided repository.
   */
  const handleExamineButton = useCallback(
    async repoUrl => {
      const roleNameExpr = new RegExp(`^.*/(.*/.*).git$`);
      const matched = roleNameExpr.exec(repoUrl);
      try {
        props.setRepoName(matched[1].replace('/', '_').toLowerCase());
        props.setOriginalRepoName(matched[1]);
      } catch (e) {
        props.setRepoName(__('COULD NOT EXTRACT NAME'));
      }

      setIsLoading(true);

      const repoInfoRequest = await getRepoInfo(
        props.smartProxies[props.smartProxySelection],
        repoUrl
      );

      if (!repoInfoRequest.ok) {
        setIsLoading(false);
        props.setAlertText(__('Could not request metadata. Use manual input.'));
        props.setIsErrorState(true);
        props.setBranchTagsEnabled(false);
      } else {
        props.setRepoInfo(repoInfoRequest.result);
        setIsLoading(false);
        props.setBranchTagsEnabled(true);
      }
    },
    [props]
  );
  const handleTextInput = (gitLink, event) => {
    setTextInput(gitLink);
    props.setRepoInfo({
      branches: {},
      tags: {},
      vcs_url: gitLink,
    });
    props.setBranchTagsEnabled(false);
  };

  useEffect(() => {
    const validLink = /^.*\.git$/.test(textInput);
    const httpUrl = /^https?:\/\/.*$/.test(textInput);

    if (!isFirstRender.current) {
      if (validLink && httpUrl) {
        if (props.smartProxySelection.length !== 0) {
          setButtonActive(true);
        }
        setValidated('success');
      } else {
        setValidated('error');
        if (!validLink) {
          setInvalidText(__('Not a valid Git URL'));
        } else if (!httpUrl) {
          setInvalidText(__('Only URLs using http/https are supported'));
        }
        setButtonActive(false);
      }
    } else {
      isFirstRender.current = false;
    }
  }, [textInput, props.smartProxySelection]);

  return (
    <React.Fragment>
      <Form>
        <FormGroup
          label={__('Git-URL')}
          helperText=""
          helperTextInvalid={invalidText}
          validated={validated}
          labelIcon={
            <Popover
              headerContent={
                <div>{__('Enter a valid Git URL that uses http/https')}</div>
              }
            >
              <button
                type="button"
                aria-label="More info for git link input field"
                onClick={e => e.preventDefault()}
                aria-describedby="simple-form-name-01"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
            </Popover>
          }
          isRequired
        >
          <InputGroup>
            <TextInput
              data-testid="GitLinkInputComponentTextInput"
              validated={validated}
              value={textInput}
              onChange={handleTextInput}
              id="text-input"
              placeholder="https://github.com/example/example.git"
            />
            <React.Fragment>
              <Button
                isDisabled={!isButtonActive}
                variant="control"
                id="primary-loading-button"
                onClick={() => handleExamineButton(textInput)}
                {...primaryLoadingProps}
              >
                {__('Load metadata')}
              </Button>{' '}
            </React.Fragment>
          </InputGroup>
        </FormGroup>
      </Form>
    </React.Fragment>
  );
};

GitLinkInputComponent.propTypes = {
  setRepoName: PropTypes.func,
  setOriginalRepoName: PropTypes.func,
  smartProxies: PropTypes.object,
  smartProxySelection: PropTypes.array,
  setAlertText: PropTypes.func,
  setIsErrorState: PropTypes.func,
  setRepoInfo: PropTypes.func,
  repoInfo: PropTypes.object,
  setBranchTagsEnabled: PropTypes.func,
};

GitLinkInputComponent.defaultProps = {
  setRepoName: () => {},
  setOriginalRepoName: () => {},
  smartProxies: {},
  smartProxySelection: [],
  setAlertText: () => {},
  setIsErrorState: () => {},
  setRepoInfo: () => {},
  repoInfo: {},
  setBranchTagsEnabled: () => {},
};
