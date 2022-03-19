import {combineReducers} from 'redux';
import {lotteryListReducer} from './lotteryReducer'

const allReducers = combineReducers({
    lottery: lotteryListReducer
});

export default allReducers;