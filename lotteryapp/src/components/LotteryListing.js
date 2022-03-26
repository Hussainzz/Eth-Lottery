import {useEffect, useState, useCallback} from 'react';
import {
  Box,
  Button,
  Input,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Heading,
  Text,
  Badge,
  Stack,
  useToast
} from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import { useSelector } from "react-redux";
import useLotteryContract from "../hooks/useLotteryContract";
import Spinner from "./Spinner";
import { checkIfLoading, checkIfError } from '../redux/reducers/selector';
import ToastMessage from './ToastMessage';
import {ethers} from 'ethers';
import useLotteryAction from '../hooks/useLotteryActions';
import {getEMessage, eventMessage} from '../errorMessages';
import { useMetaMaskAccount } from '../context/AccountContext';
import { useContractEvent, useProvider } from 'wagmi';
import Confetti from 'react-confetti'
import LotteryContract from '../contracts/Lottery.json';


const backgrounds = [
  `url("data:image/svg+xml, %3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'560\' height=\'185\' viewBox=\'0 0 560 185\' fill=\'none\'%3E%3Cellipse cx=\'102.633\' cy=\'61.0737\' rx=\'102.633\' ry=\'61.0737\' fill=\'%23ED64A6\' /%3E%3Cellipse cx=\'399.573\' cy=\'123.926\' rx=\'102.633\' ry=\'61.0737\' fill=\'%23F56565\' /%3E%3Cellipse cx=\'366.192\' cy=\'73.2292\' rx=\'193.808\' ry=\'73.2292\' fill=\'%2338B2AC\' /%3E%3Cellipse cx=\'222.705\' cy=\'110.585\' rx=\'193.808\' ry=\'73.2292\' fill=\'%23ED8936\' /%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ED8936'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%2348BB78'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%230BC5EA'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED8936'/%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%2348BB78'/%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%230BC5EA'/%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ECC94B'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%239F7AEA'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%234299E1'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%2348BB78'/%3E%3C/svg%3E")`,
];

function Lottery(props) {
  const { index,lotteryId,enterLotteryHandler, entryBtnLoaders, pickWinnerHandler, winBtnLoaders, setDeclareWinner } = props;
  const [entryFee, setEntryFee] = useState('');
  const { connectedAddr } = useMetaMaskAccount();
  const {getLotteryDetail} = useLotteryContract();
  const {details, manager} = useSelector(state => state.lottery);
  const loadingState = useSelector(state => state.loading);
  const isDetailLoading = checkIfLoading(loadingState, 'FETCHING_LOTTERY_DETAIL_SUCCESS')

  useEffect(() => {
    (async()=>{
      await getLotteryDetail(lotteryId);
    })()
  },[entryBtnLoaders[lotteryId]])


  useContractEvent(
    {
        addressOrName: process.env.REACT_APP_LOTTERY_CONTRACT,
        contractInterface: LotteryContract.abi,
    },
    'WinnerDeclared',
    (event) => {
      console.log(event);
      console.log(details[lotteryId.toString()]);

      if(typeof details[lotteryId.toString()] !== 'undefined'){
        if(!details[lotteryId.toString()].active){
          console.log('Announced Winner');
          setDeclareWinner(true);
        }
      }
        
    },{
      once: true
    }
  )
 
  return (
    <Flex
      boxShadow={"lg"}
      maxW={"640px"}
      direction={{ base: "column-reverse", md: "row" }}
      width={"full"}
      rounded={"xl"}
      p={10}
      justifyContent={"space-between"}
      position={"relative"}
      bg={useColorModeValue("white", "gray.800")}
      _before={{
        content: '""',
        position: "absolute",
        zIndex: "-1",
        height: "full",
        maxW: "640px",
        width: "full",
        filter: "blur(40px)",
        transform: "scale(0.98)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        top: 0,
        left: 0,
        backgroundImage: backgrounds[index % 4],
      }}
    >
      <Flex
        direction={"column"}
        textAlign={"left"}
        justifyContent={"space-between"}
      >
        <Heading fontSize={"1xl"} fontWeight={300} fontFamily={"body"}>
          Eth-Lottery
        </Heading>
        <Text color={"gray.500"}>
          <Badge variant="solid" colorScheme="green">
            ID: {lotteryId.toString()}
          </Badge>
        </Text>

        {isDetailLoading ? <Spinner/> :
            <>
              {(typeof details[lotteryId.toString()] !== 'undefined') ?
                <>
                  <Text fontSize={"sm"} color={"gray.500"} pt={4}>
                    Active Players {details[lotteryId.toString()].players}
                  </Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Ticket Price {details[lotteryId.toString()].ticketPrice} Eth
                  </Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Price Pool {details[lotteryId.toString()].pricePool} Eth
                  </Text>
                </>
                : ''
              }
            </>
        }
       

       {(typeof details[lotteryId.toString()] !== 'undefined') ?
        <Box pt={4}>
          {(!details[lotteryId.toString()].active) && 
              <>
              <Input type="number" placeholder="Enter Eth" size="sm" value={entryFee} onChange={(e) => setEntryFee(e.target.value)}/>
                <Button
                  size="sm"
                  w={"full"}
                  mt={3}
                  bg={"#3182ce"}
                  color={"white"}
                  rounded={"md"}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  onClick={() => {enterLotteryHandler(lotteryId, entryFee)}}
                  isLoading={entryBtnLoaders[lotteryId]}
                  id={`enterBtn${lotteryId}`}
                >
                  Enter Lottery
                </Button>

                {((connectedAddr == manager )&&(details[lotteryId.toString()].players >= 1)) &&
                  <Button size="xs"
                  w={"full"}
                  mt={3}
                  bg={"#000000"}
                  color={"white"}
                  rounded={"md"}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }} onClick={() => {pickWinnerHandler(lotteryId)}} isLoading={winBtnLoaders[lotteryId]}>PickWinner</Button>
                }
              </>
          }
          {
            (details[lotteryId.toString()].active) &&  
            <>
              <Text as='i' pr="2">Winner</Text>
              <Badge variant='solid' colorScheme='green'>
                {details[lotteryId.toString()].winner}
              </Badge>
            </>
          }
        </Box>
        :''}
      </Flex>
      <Icon as={FaEthereum} boxSize="50" />
    </Flex>
  );
}

export default function LotteryListing() {
  const provider = useProvider()
  const toast = useToast();
  const [reloadList, setReloadList] = useState(true);
  const [declareWinner, setDeclareWinner] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const { connectedAddr, connected} = useMetaMaskAccount();
  const [entryBtnLoaders, setEntryBtnLoaders] = useState({})
  const [winBtnLoaders, setWinBtnLoaders] = useState({})
  const {
    txnData,
    txnError, 
    txnLoading, 
    callContract,
    waitData:entryLWaitData, waitError:entryLWaitError, waitLoading:entryLWaitLoading, wait
  } = useLotteryAction('enterLottery');

  const {
    txnData: startLData,
    txnError: startLError, 
    txnLoading: startLLoading, 
    callContract:startLottery, waitData:startLWaitResult, waitError:startLWaitError, waitLoading:startLWaitLoading, wait: swait } = useLotteryAction('startLottery');

  const {
    txnData: winnerTxn,
    txnError: winnerTxnErr, 
    txnLoading: winnerLoading, 
    callContract:pickWinner,
    waitData:winLWaitData, waitError:winLWaitError, waitLoading:winLWaitLoading, wait:pickWait,
    LotteryContract
  } = useLotteryAction('pickWinner');

  const {contract, fetchAllLotteryIds} = useLotteryContract();
  const {allLotteryIds, manager} = useSelector(state => state.lottery);
  const loadingState = useSelector(state => state.loading);
  
  const isLoading = checkIfLoading(loadingState, 'FETCH_LOTTERY_IDS')
  const hasError = checkIfError(loadingState,'FETCH_LOTTERY_IDS');

  //start Lottery Event 
  useEffect(() => {
    if((typeof startLWaitResult !== "undefined") && (!startLWaitLoading)){
      handleEvents(startLWaitResult, 'LotteryCreated')
    }
  },[startLWaitResult, startLWaitLoading]);

  //enter Lottery
  useEffect(() => {
    if((typeof entryLWaitData !== "undefined") && (!entryLWaitLoading)){
     handleEvents(entryLWaitData, 'NewLotteryPlayer')
    }
 },[entryLWaitData, entryLWaitLoading]);

 //Picking Winner
 useEffect(() => {
  if((typeof winLWaitData !== "undefined") && (!winLWaitLoading)){
   handleEvents(winLWaitData, 'RandomnessRequested')
  }
},[winLWaitData, winLWaitLoading]);


  //event handler
  const handleEvents = async (eventData, eventType) => {
    const currentBlock = await provider.getBlockNumber();
    console.log(currentBlock);
    console.log(eventData.blockNumber);
    console.log(eventData);
    if(eventData.events){
      
      const e = eventData.events.find(eve => eve.event === eventType);
      console.log(e);
      if(typeof e !== "undefined"){
        toast({
          title:  eventMessage(e.event) ,
          status: 'success',
          isClosable: true,
        });
  
        if(e.event === 'NewLotteryPlayer'){
          setEntryBtnLoaders(prevS => {
            return {
              ...prevS,
              [e.args[0].toString()]: entryLWaitLoading
            }
          });
        }
  
        if(e.event === 'LotteryCreated') {
          setReloadList(true);
        }
  
        if(e.event === 'RandomnessRequested'){
          //setDeclareWinner(true);
          setWinBtnLoaders(prevS => {
            return {
              ...prevS,
              [e.args[1].toString()]: winLWaitLoading
            }
          });
        }
      }

    }
  }


  useEffect(() => {
    handlerTxnErrors(txnError);
    setEntryBtnLoaders({})
  },[txnError])

  useEffect(() => {
    handlerTxnErrors(startLError);
  },[startLError])

  useEffect(() => {
    handlerTxnErrors(winnerTxnErr);
    setWinBtnLoaders({})
  },[winnerTxnErr])

  const handlerTxnErrors = async(err) => {
    if(typeof err !== "undefined"){
      if(err?.name && err.name === "UserRejectedRequestError"){
        toast({
          title: 'User rejected the transaction',
          status: 'error',
          isClosable: true,
        });
        return;
      }
      toast({
        title: getEMessage(err.data.message),
        status: 'error',
        isClosable: true,
      });
    } 
  }


  useEffect(() => {
      if(!reloadList) return;
      (async () => {
        await fetchAllLotteryIds();
        setReloadList(false);
      })()
  },[reloadList])


  //enter lottery action
  const enterLotteryHandler = useCallback(async(lotteryId, ethValue) => {
    if(ethValue === "") return;
    if(!connected){
      toast({
        title: 'Please Connect to MetaMask',
        status: 'error',
        isClosable: true,
      });
      return;
    }
    setEntryBtnLoaders(prevS => {
      return {
        ...prevS,
        [lotteryId]: true
      }
    });
    const txn = await callContract({
      args: [lotteryId],
      overrides: {
        value: ethers.utils.parseEther(ethValue.toString())
      }
    });
    if(typeof txn.data !== 'undefined'){
      await wait({wait: txn.data.wait});
    }
  },[connected]);

  //start lottery action
  const startLotteryHandler = async () => {
    if(!connected){
      toast({
        title: 'Please Connect to MetaMask',
        status: 'error',
        isClosable: true,
      });
      return;
    }
    const txn = await startLottery();
    if(typeof txn.data !== 'undefined'){
      await swait({wait: txn.data.wait});
    }
  };

  const pickWinnerHandler = useCallback(async(lotteryId) => {
    if(!connected){
      toast({
        title: 'Please Connect to MetaMask',
        status: 'error',
        isClosable: true,
      });
      return;
    }
    setWinBtnLoaders(prevS => {
      return {
        ...prevS,
        [lotteryId]: true
      }
    });
    const txn = await pickWinner({
      args: [lotteryId]
    });
    if(typeof txn.data !== 'undefined'){
      await pickWait({wait: txn.data.wait});
    }
  },[connected]);

  useEffect(() => {
    if(declareWinner){
      setConfetti(300);
      setTimeout(
        () => setConfetti(0), 
        20000
      );
    }
  },[declareWinner])

  return (
   <>
   {((connected) && (connectedAddr === manager)) && 
    <Flex textAlign={"center"}
        pt={8}
        ml={20}
        justifyContent={"flex-start"}
        direction={"row"}
        >
      <Button colorScheme="blue" isLoading={startLWaitLoading} onClick={startLotteryHandler}>Start Lottery</Button>
    </Flex>
    }
     <Flex
      textAlign={"center"}
      pt={3}
      justifyContent={"center"}
      direction={"column"}
      width={"full"}
      >
        {(confetti !== 0) && <Confetti numberOfPieces={confetti}/>} 
        
       { (!isLoading) ?
        <>
          {allLotteryIds.length && !hasError?
              <SimpleGrid
                p={4}
                columns={{ base: 1, xl: 3 }}
                spacing={"8"}
                mt={8}
                ml={4}
              >
                
                {allLotteryIds.map((data, index) =>(
                  <Lottery index={index} key={index} lotteryId={data} enterLotteryHandler={enterLotteryHandler} entryBtnLoaders={entryBtnLoaders} winBtnLoaders={winBtnLoaders} pickWinnerHandler={pickWinnerHandler} setDeclareWinner={setDeclareWinner}/>
                ))}
              </SimpleGrid>:

              <Stack direction="row" alignItems="center" justifyContent={'center'} pt="8">
                <Text p="10">No Active Lotteries Currently</Text>
              </Stack>
            }
              
        </>
      
       : <Spinner loading size={40} applyPadding/>}
       {/* <LotteryDetailModal isOpen={isOpen} onClose={onClose} lId={modalLotteryId} data={details} isDetailLoading={isDetailLoading} /> */}
       <ToastMessage message={hasError} toastType="error"/>
    </Flex>
   </>
  );
}
