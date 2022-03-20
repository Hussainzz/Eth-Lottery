export const startAction = (name, params) => ({
    type: 'START_ACTION',
    payload: {
      action: { name, params }
    }
  });
  
  export const stopAction = (name,params) => ({
    type: 'STOP_ACTION',
    payload: {
      action: { name, params }
    }
  });

  export const errorAction = (name, message) => ({
    type: 'ERROR_ACTION',
    payload: {
        etype: name,
        error: { 
          [name]: message 
        }
    }
  });