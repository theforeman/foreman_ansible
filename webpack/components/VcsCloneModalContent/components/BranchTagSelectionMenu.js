import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  TabTitleText,
  Form,
  FormGroup,
  TextInput,
  Popover,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { MultiSelectorMenu } from './MultiSelectorMenu';

export const BranchTagSelectionMenu = props => {
  const [activeTabKey, setActiveTabKey] = useState(2);

  useEffect(() => {
    if (!props.branchTagsEnabled) {
      setActiveTabKey(2);
    }
  }, [props.branchTagsEnabled]);

  return (
    <Tabs
      isFilled
      activeKey={activeTabKey}
      onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}
      isBox
    >
      <Tab
        data-testid="BranchTagSelectionMenuBranchTab"
        eventKey={0}
        title={<TabTitleText>{__('Branches')}</TabTitleText>}
        isDisabled={!props.branchTagsEnabled}
      >
        <MultiSelectorMenu
          repoInfo={props.repoInfo}
          displayData="branches"
          gitRef={props.gitRef}
          setGitRef={props.setGitRef}
        />
      </Tab>
      <Tab
        data-testid="BranchTagSelectionMenuTagTab"
        eventKey={1}
        title={<TabTitleText>{__('Tags')}</TabTitleText>}
        isDisabled={!props.branchTagsEnabled}
      >
        <MultiSelectorMenu
          repoInfo={props.repoInfo}
          displayData="tags"
          gitRef={props.gitRef}
          setGitRef={props.setGitRef}
        />
      </Tab>
      <Tab
        data-testid="BranchTagSelectionMenuManualTab"
        eventKey={2}
        title={<TabTitleText>{__('Manual input')}</TabTitleText>}
      >
        <Form>
          <FormGroup
            label={__('Branch / Tag / Commit')}
            labelIcon={
              <Popover
                headerContent={
                  <div>
                    {__('Enter a valid')}{' '}
                    <a
                      href="https://git-scm.com/book/en/v2/Git-Internals-Git-References"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {__('Git reference')}
                    </a>
                    .
                  </div>
                }
              >
                <button
                  type="button"
                  aria-label="More info for ref selection field"
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
            <TextInput
              id="branch_tag_commit_input"
              value={props.gitRef}
              onChange={value => props.setGitRef(value)}
            />
          </FormGroup>
        </Form>
      </Tab>
    </Tabs>
  );
};

BranchTagSelectionMenu.propTypes = {
  repoInfo: PropTypes.object,
  gitRef: PropTypes.string,
  setGitRef: PropTypes.func,
  branchTagsEnabled: PropTypes.bool,
};

BranchTagSelectionMenu.defaultProps = {
  repoInfo: {
    branches: {},
    tags: {},
    vcs_url: null,
  },
  gitRef: 'main',
  setGitRef: () => {},
  branchTagsEnabled: false,
};
