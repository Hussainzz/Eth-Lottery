import {useEffect, useCallback} from 'react'
import * as wagmi from 'wagmi';
import {useProvider, useSigner} from 'wagmi';
import {useSelector, useDispatch} from 'react-redux';

import LotteryContract from '../contracts/Lottery.json';


const useLotteryContract = () => {
    const  dispatch = useDispatch();

    const {allLotteryIds, loading:fetchingLotteryIds} = useSelector(state => state.lottery);

    const [signer] = useSigner();

    const provider = useProvider();

    const contract = wagmi.useContract({
        addressOrName: process.env.REACT_APP_LOTTERY_CONTRACT,
        contractInterface: LotteryContract.abi,
        signerOrProvider: signer.data || provider
    });

    useEffect(() =>{
        async function getAllIds(){
            await getLotteryIds();
        }
        getAllIds();
    },[])


    useEffect(() =>{
        async function getManager(){
            await getLotteryManagerAddress();
        }
        getManager();
    },[])

    useEffect(() =>{
        (async() => {
            await getLotteryAllowedCount();
        })()
    },[])

    
    const getLotteryAllowedCount = async() => {
        try {
            dispatch({
                type:'FETCHING_ALLOWED_COUNT'
            })
            const allowedPlayerCount = await contract.totalAllowedPlayers();
            dispatch({
                type:'SAVE_ALLOWED_COUNT',
                payload: allowedPlayerCount
            });
        } catch (error) {
            dispatch({
                type:'FETCHING_ALLOWED_COUNT_FAILED',
                payload: 'Error while fetching allowed count'
            });
        }
    }

    const getLotteryManagerAddress = async() => {
        try {
            dispatch({
                type:'FETCHING_MANAGER_ADDR'
            })
            const manager = await contract.lotteryManager();
            dispatch({
                type:'SAVE_MANAGER',
                payload: manager
            });
        } catch (error) {
            dispatch({
                type:'FETCHING_MANAGER_ADDR_FAILED',
                payload: 'Error while fetching manager address'
            });
        }
    }

    const getLotteryIds = useCallback(async () =>{
        dispatch({
            type:'REQUEST_LOTTERY_LISTS'
        });
        try{
            const lotteries = await contract.getAllLotteryIds();
            dispatch({
                type:'REQUEST_LOTTERY_LISTS_FETCHED',
                payload: lotteries
            });
        }catch(e){
            console.log(e)
            dispatch({
                type:'REQUEST_LOTTERY_LISTS_FAILED',
                payload: 'Error while fetching lotteryIds'
            });
        }
    },[contract, dispatch])

    const startLottery = async()=>{
        await contract.startLottery({
            from: signer.data._address
        })
    }

    return {
        allLotteryIds,
        fetchingLotteryIds,
        getLotteryManagerAddress,
        startLottery
    }
}

export default useLotteryContract;