import { connect } from 'react-redux';

import AnsibleHostParams from './AnsibleHostParams';
import {
  selectAssignedVariables,
  selectVariablesLoading,
  selectFormObject,
} from '../AnsibleRolesSwitcher/AnsibleRolesSwitcherSelectors';

import { selectResourceErrors } from 'foremanReact/components/ResourceErrors/ResourceErrorsSelectors';

const mapStateToProps = state => {
  return { assignedRoles: selectAssignedVariables(state),
           loading: selectVariablesLoading(state),
           resourceErrors: selectResourceErrors(state),
           formObject: selectFormObject(state),
           highlightTabErrors: window.tfm.tools.highlightTabErrors }
}

export default connect(mapStateToProps, {})(AnsibleHostParams);
