import LotteryContract from '../contracts/Lottery.json';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

const useLotteryAction = (funcName) => {    

    const [{ data, error, loading }, write] = useContractWrite(
        {
          addressOrName: process.env.REACT_APP_LOTTERY_CONTRACT,
          contractInterface: LotteryContract.abi
        },
        funcName
    );

    const [waitResult, wait] = useWaitForTransaction({
        wait: data?.wait
    })
    
    return {
        txnData: data,
        txnError: error, 
        txnLoading: loading, 
        callContract: write,
        waitResult,
        wait
    }
};

export default useLotteryAction;