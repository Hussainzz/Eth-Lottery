import { useCallback} from 'react'
import * as wagmi from 'wagmi';
import {useProvider, useSigner} from 'wagmi';
import {useDispatch} from 'react-redux';
import {ethers} from 'ethers';
import LotteryContract from '../contracts/Lottery.json';
import { startAction, stopAction, errorAction } from '../redux/reducers/uiActions';


const useLotteryContract = () => {
    const  dispatch = useDispatch();

    const [signer] = useSigner();

    const provider = useProvider();

    const contract = wagmi.useContract({
        addressOrName: process.env.REACT_APP_LOTTERY_CONTRACT,
        contractInterface: LotteryContract.abi,
        signerOrProvider: signer.data || provider
    });

    const getLotteryAllowedCount = async() => {
        dispatch(startAction('FETCHING_ALLOWED_COUNT'));
        try {
            const allowedPlayerCount = await contract.totalAllowedPlayers();
            dispatch({
                type:'FETCHING_ALLOWED_COUNT_SUCCESS',
                payload: allowedPlayerCount.toString()
            });
        } catch (e) {
            console.log('fetching lottery allowed count failed', e);
            dispatch(errorAction('FETCHING_ALLOWED_COUNT', 'Error while fetching allowed count'));
        }
        dispatch(stopAction('FETCHING_ALLOWED_COUNT'))

    }

    const getLotteryManagerAddress = async() => {
        dispatch(startAction('FETCH_LOTTERY_MANAGER'));
        try {
            const manager = await contract.lotteryManager();
            dispatch({
                type:'FETCH_LOTTERY_MANAGER_SUCCESS',
                payload: manager
            });
        } catch (e) {
            console.log('fetching lottery manager failed', e);
            dispatch(errorAction('FETCH_LOTTERY_MANAGER', 'Error while fetching lottery manager'));
        }
        dispatch(stopAction('FETCH_LOTTERY_MANAGER'))
    }

    const fetchAllLotteryIds = async () => {
        dispatch(startAction('FETCH_LOTTERY_IDS'));
        try{
            const lotteries = await contract.getAllLotteryIds();
            dispatch({
                type:'FETCH_LOTTERY_IDS_SUCCESS',
                payload: lotteries
            });
        }catch(e){
            console.log('fetching all lotteryIds failed', e);
            dispatch(errorAction('FETCH_LOTTERY_IDS', 'Error while fetching all lotteryIds'));

        }
        dispatch(stopAction('FETCH_LOTTERY_IDS'))
    }


    const startLottery = async()=>{
        await contract.startLottery({
            from: signer.data._address
        })
    }

    const enterLottery = async(lotteryId, eth)=>{
        await contract.enterLottery(lotteryId.toString(),{
            from: signer.data._address,
            value: ethers.utils.parseEther(eth)
        })
    }

    return {
        fetchAllLotteryIds,
        getLotteryManagerAddress,
        getLotteryAllowedCount,
        startLottery,
        enterLottery
    }
}

export default useLotteryContract;