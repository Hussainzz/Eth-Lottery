import {useEffect} from 'react'
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


    const getLotteryManagerAddress = async() => {
        try {
            const manager = await contract.lotteryManager();
            return manager;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const getLotteryIds = async () =>{
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
            dispatch({
                type:'REQUEST_LOTTERY_LISTS_FAILED',
                payload: 'Error while fetching lotteryIds'
            });
        }
    }

    const startLottery = async()=>{
        await contract.startLottery({
            from: signer.data._address
        })
    }

    return {
        allLotteryIds,
        fetchingLotteryIds,
        getLotteryManagerAddress
    }
}

export default useLotteryContract;