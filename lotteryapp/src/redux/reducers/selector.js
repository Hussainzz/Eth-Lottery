export const checkIfLoading = (store, ...actionsToCheck) =>
  store.loader.actions.some(action => actionsToCheck.includes(action.name));

export const checkIfError = (store, type) => {
    if(typeof store.loader.errors[type] !== 'undefined') return store.loader.errors[type];
    return null;
}
    