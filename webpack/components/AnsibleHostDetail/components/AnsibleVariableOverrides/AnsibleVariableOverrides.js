import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'foremanReact/components/Loading';

import { useQuery } from '@apollo/client';
import variableOverrides from '../../../../graphql/queries/variableOverrides.gql';
import AnsibleVariableOverridesTable from './AnsibleVariableOverridesTable';

import { encodeId } from '../../../../globalIdHelper';
import './AnsibleVariableOverrides.scss';

const AnsibleVariableOverrides = ({ id, hostAttrs }) => {
  const { loading, data, error } = useQuery(variableOverrides, {
    variables: { hostId: id, id: encodeId('Host', id) },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const variables = data.host.allAnsibleRoles.nodes.reduce((memo, role) => {
    const vars = role.ansibleVariablesWithOverrides.nodes.map(variable => ({
      ...variable,
      roleName: role.name,
    }));
    return memo.concat(vars);
  }, []);

  return (
    <div className="ansible-tab-margin">
      <AnsibleVariableOverridesTable
        variables={variables}
        hostAttrs={hostAttrs}
      />
    </div>
  );
};

AnsibleVariableOverrides.propTypes = {
  id: PropTypes.number.isRequired,
  hostAttrs: PropTypes.object.isRequired,
};

export default AnsibleVariableOverrides;
