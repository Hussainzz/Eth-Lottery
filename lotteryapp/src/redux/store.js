import {createStore,applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import allReducers from './reducers';


const middleware = [thunk]
const store = createStore(
    allReducers,
    (process.env.REACT_APP_ENV !== "DEVELOPMENT")?compose(applyMiddleware(...middleware)):
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;