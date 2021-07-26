import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import { useQuery } from '@apollo/client';
import variableOverrides from '../../../../graphql/queries/variableOverrides.gql';
import AnsibleVariableOverridesTable from './AnsibleVariableOverridesTable';

import { encodeId } from '../../../../globalIdHelper';
import { reorderVariables } from './AnsibleVariableOverridesHelper';
import './AnsibleVariableOverrides.scss';

const AnsibleVariableOverrides = ({ hostAttrs }) => {
  const { id } = hostAttrs;

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
      variables={reorderVariables(data.host.allAnsibleRoles.nodes)}
      hostAttrs={hostAttrs}
    />
  );
};

AnsibleVariableOverrides.propTypes = {
  hostAttrs: PropTypes.object.isRequired,
};

export default AnsibleVariableOverrides;
