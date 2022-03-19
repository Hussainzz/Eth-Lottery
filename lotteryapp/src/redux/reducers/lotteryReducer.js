export const lotteryListReducer = (state={
    loading: true,
    allLotteryIds:[]
}, action) => {
    switch(action.type) {
        case 'REQUEST_LOTTERY_LISTS':
            return {
                loading: true
            }
        case 'REQUEST_LOTTERY_LISTS_FETCHED':
            return{
                loading: false,
                allLotteryIds: action.payload
            }
        case 'FETCHED_LOTTERY_MANAGER':
            return {
                lotteryManager: action.payload
            }
        case 'REQUEST_LOTTERY_LISTS_FAILED':
            return{
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}