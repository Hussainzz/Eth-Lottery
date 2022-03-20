import {combineReducers} from 'redux';
import {lotteryListReducer} from './lotteryReducer'
import uiReducer from './uiReducer';

const allReducers = combineReducers({
    lottery: lotteryListReducer,
    loading: uiReducer
});

export default allReducers;