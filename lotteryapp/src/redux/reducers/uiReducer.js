import isEqual from 'lodash.isequal';

const initialState = {
  loader: {
    actions: [],
    errors: []
  }
};

const uiReducer = (state = initialState, { type, payload }) => {
  const { loader } = state;
  const { actions, errors } = loader;
 
  switch (type) {
    case 'START_ACTION':
      return {
        ...state,
        loader: {
          ...loader,
          actions: [...actions, payload.action]
        }
      };
    case 'STOP_ACTION':
      return {
        ...state,
        loader: {
          ...loader,
          actions: actions.filter(action => {
            if (action.name !== payload.action.name) {
              return true;
            } else if (!isEqual(action.params, payload.action.params)) {
              return true
            } else {
              return false
            }
          })
        }
      };
    case 'ERROR_ACTION':
    return {
      ...state,
      loader: {
        ...loader,
        errors: {
          ...errors, 
          [payload.etype]: payload.error[payload.etype]
        }
      }
    };
    default:
      return state;
  }
  
};

export default uiReducer;