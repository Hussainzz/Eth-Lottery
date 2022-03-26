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

    const [{data:waitData, error:waitError, loading:waitLoading}, wait] = useWaitForTransaction({
        skip: true
    });
    
    return {
        txnData: data,
        txnError: error, 
        txnLoading: loading, 
        callContract: write,
        LotteryContract,
        waitData,
        waitError,
        waitLoading,
        wait
    }
};

export default useLotteryAction;