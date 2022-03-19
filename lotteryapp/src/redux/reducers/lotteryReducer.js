export const lotteryListReducer = (state={
    loading: true,
    allLotteryIds:[],
    fetchingManagerAddr:true,
    manager:null,
    fetchingAllowedCount:true,
    allowedCount:''
}, action) => {
    switch(action.type) {
        case 'REQUEST_LOTTERY_LISTS':
            return {
                ...state,
                loading: true
            }
        case 'REQUEST_LOTTERY_LISTS_FETCHED':
            return{
                ...state,
                loading: false,
                allLotteryIds: action.payload
            }
        case 'REQUEST_LOTTERY_LISTS_FAILED':
            return{
                ...state,
                loading: false,
                error: action.payload
            }

        case 'FETCHING_MANAGER_ADDR':
            return{
                ...state,
                fetchingManagerAddr:true
            }
        case 'SAVE_MANAGER':
            return{
                ...state,
                fetchingManagerAddr:false,
                manager: action.payload,
            }
        case 'FETCHING_MANAGER_ADDR_FAILED':
            return{
                ...state,
                fetchingManagerAddr:false,
                errorFetchingManager: action.payload
            }
        
        case 'FETCHING_ALLOWED_COUNT':
            return{
                ...state,
                fetchingAllowedCount:true
            }
        case 'SAVE_ALLOWED_COUNT':
            return{
                ...state,
                fetchingAllowedCount:false,
                allowedCount: action.payload,
            }
        case 'FETCHING_ALLOWED_COUNT_FAILED':
            return{
                ...state,
                fetchingAllowedCount:false,
                errorFetchingAllowedCount: action.payload
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