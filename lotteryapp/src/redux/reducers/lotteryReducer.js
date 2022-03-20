export const lotteryListReducer = (state={
    allLotteryIds:[],
    manager:null,
    allowedCount:''
}, action) => {
    switch(action.type) {
        case 'FETCH_LOTTERY_IDS_SUCCESS':
            return{
                ...state,
                allLotteryIds: action.payload
            }
        case 'FETCH_LOTTERY_MANAGER_SUCCESS':
            return{
                ...state,
                manager: action.payload,
            }
        case 'FETCHING_ALLOWED_COUNT_SUCCESS':
            return{
                ...state,
                allowedCount: action.payload
            }    
        default:
            return state
    }
}

export const lotteryDataReducer = (state = {
    loading: true,
    lotteryData:[]
}, action) => {
    switch(action.type) {
        case 'FETCH_LOTTERY_DATA':
            return {
                loading: true
            }
        case 'FETCH_LOTTERY_DATA_SUCCESS':
            return{
                loading: false,
                lotteryData: action.payload
            }
        case 'FETCH_LOTTERY_DATA_FAILED':
            return{
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}