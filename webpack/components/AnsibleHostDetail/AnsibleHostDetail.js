import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import SkeletonLoader from 'foremanReact/components/common/SkeletonLoader';

import SecondaryTabRoutes from './components/SecondaryTabRoutes';
import { SECONDARY_TABS } from './constants';
import './AnsibleHostDetail.scss';
import { hashRoute } from './helpers';

const AnsibleHostDetail = ({
  response,
  status,
  router,
  location: { pathname },
}) => (
  <SkeletonLoader status={status} skeletonProps={{ count: 5 }}>
    {response?.id && (
      <>
        <Tabs activeKey={pathname?.split('/')[2]} isSecondary>
          {SECONDARY_TABS.map(({ key, title }) => (
            <Tab
              key={key}
              eventKey={key}
              title={<TabTitleText>{title}</TabTitleText>}
              href={hashRoute(key)}
            />
          ))}
        </Tabs>
        <SecondaryTabRoutes response={response} router={router} />
      </>
    )}
  </SkeletonLoader>
);

AnsibleHostDetail.propTypes = {
  response: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  location: PropTypes.object,
  router: PropTypes.object.isRequired,
};

AnsibleHostDetail.defaultProps = {
  location: { pathname: '' },
};

export default AnsibleHostDetail;
