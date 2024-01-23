import Immutable from 'seamless-immutable';
import {
  CLOSE_YAML_IMPORT,
  OPEN_YAML_IMPORT,
  OPEN_YAML_IMPORT_FROM_ROLE,
} from './YamlVariablesImporterConstants';

export const initialState = Immutable({
  isModalOpen: false,
  fromRole: false,
  roleName: null,
});

const yamlVariablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_YAML_IMPORT:
      return state.merge({
        isModalOpen: true,
      });
    case OPEN_YAML_IMPORT_FROM_ROLE:
      return state.merge({
        isModalOpen: true,
        fromRole: true,
        roleName: action.payload ? action.payload.roleName : null,
      });
    case CLOSE_YAML_IMPORT:
      return state.merge({
        isModalOpen: false,
      });
    default:
      return state;
  }
};

export default yamlVariablesReducer;
