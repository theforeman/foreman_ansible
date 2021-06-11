import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import { useQuery } from '@apollo/client';
import variableOverrides from '../../../../graphql/queries/variableOverrides.gql';
import AnsibleVariableOverridesTable from './AnsibleVariableOverridesTable';

import { encodeId } from '../../../../globalIdHelper';
import { extractVariables } from './AnsibleVariableOverridesHelper';
import './AnsibleVariableOverrides.scss';

const AnsibleVariableOverrides = ({ id, hostAttrs, showToast }) => {
  const { loading, data, error } = useQuery(variableOverrides, {
    variables: { hostId: id, id: encodeId('Host', id) },
  });

  if (loading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <AnsibleVariableOverridesTable
      variables={extractVariables(data.host.allAnsibleRoles.nodes)}
      hostId={id}
      hostAttrs={hostAttrs}
      showToast={showToast}
    />
  );
};

AnsibleVariableOverrides.propTypes = {
  id: PropTypes.number.isRequired,
  hostAttrs: PropTypes.object.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default AnsibleVariableOverrides;
