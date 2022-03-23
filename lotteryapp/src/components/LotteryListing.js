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
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import { useSelector } from "react-redux";
import useLotteryContract from "../hooks/useLotteryContract";
import Spinner from "./Spinner";
import LotteryDetailModal from './LotteryDetailModal';
import { checkIfLoading, checkIfError } from '../redux/reducers/selector';
import ToastMessage from './ToastMessage';
import {ethers} from 'ethers';
import useLotteryAction from '../hooks/useLotteryActions';
import {getEMessage, eventMessage} from '../errorMessages';
import { useMetaMaskAccount } from '../context/AccountContext';

const backgrounds = [
  `url("data:image/svg+xml, %3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'560\' height=\'185\' viewBox=\'0 0 560 185\' fill=\'none\'%3E%3Cellipse cx=\'102.633\' cy=\'61.0737\' rx=\'102.633\' ry=\'61.0737\' fill=\'%23ED64A6\' /%3E%3Cellipse cx=\'399.573\' cy=\'123.926\' rx=\'102.633\' ry=\'61.0737\' fill=\'%23F56565\' /%3E%3Cellipse cx=\'366.192\' cy=\'73.2292\' rx=\'193.808\' ry=\'73.2292\' fill=\'%2338B2AC\' /%3E%3Cellipse cx=\'222.705\' cy=\'110.585\' rx=\'193.808\' ry=\'73.2292\' fill=\'%23ED8936\' /%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ED8936'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%2348BB78'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%230BC5EA'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED8936'/%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%2348BB78'/%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%230BC5EA'/%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ECC94B'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%239F7AEA'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%234299E1'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%2348BB78'/%3E%3C/svg%3E")`,
];

function Lottery(props) {
  const { index,lotteryId,enterLotteryHandler, showLotteryDetails, entryBtnLoaders } = props;
  const [entryFee, setEntryFee] = useState('');
  
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

        <Text fontSize={"sm"} color={"gray.500"} pt={4}>
          Active Players 2/5
        </Text>

        <Box pt={4}>
          <Input type="number" placeholder="Enter Eth" size="sm" value={entryFee} onChange={(e) => setEntryFee(e.target.value)}/>

          <Button
            size="sm"
            w={"full"}
            mt={3}
            bg={useColorModeValue("#3182ce", "gray.900")}
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

          <Button size="xs"
            w={"full"}
            mt={3}
            bg={useColorModeValue("#000000", "gray.900")}
            color={"white"}
            rounded={"md"}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }} onClick={() => {showLotteryDetails(lotteryId)}}>View Details</Button>

        </Box>
      </Flex>
      <Icon as={FaEthereum} boxSize="50" />
    </Flex>
  );
}

export default function LotteryListing() {
  const toast = useToast();
  const [reloadList, setReloadList] = useState(true);
  const [showEvent, setShowEvent] = useState(false);
  const { connectedAddr, connected} = useMetaMaskAccount();
  const [entryBtnLoaders, setEntryBtnLoaders] = useState({})
  const {
    txnData,
    txnError, 
    txnLoading, 
    callContract,
    waitResult, wait
  } = useLotteryAction('enterLottery');

  const {
    txnData: startLData,
    txnError: startLError, 
    txnLoading: startLLoading, 
    callContract:startLottery,
    waitResult:startLotteryWaitResult, wait:swait
  } = useLotteryAction('startLottery');

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalData, setModalData] = useState({});
  const {fetchAllLotteryIds} = useLotteryContract();
  const {allLotteryIds, manager} = useSelector(state => state.lottery);
  const loadingState = useSelector(state => state.loading);
  
  const isLoading = checkIfLoading(loadingState, 'FETCH_LOTTERY_IDS')
  const hasError = checkIfError(loadingState,'FETCH_LOTTERY_IDS');

  //enterLottery
  useEffect(() => {
    handlerTxnEvents(txnData, waitResult);
  },[waitResult])

  //startLottery
  useEffect(() => {
    handlerTxnEvents(startLData, startLotteryWaitResult);
  },[startLotteryWaitResult])


  const handlerTxnEvents = async(eventData, waitData) => {
    if((typeof eventData !== "undefined") && (typeof waitData.data !== "undefined") && (!waitData.loading)){
      if(showEvent && waitData.data.events){
        const e = waitData.data.events[0];
        toast({
          title:  eventMessage(e.event) ,
          status: 'success',
          isClosable: true,
        });
        setShowEvent(false);
        if(e.event === 'NewLotteryPlayer'){
          setEntryBtnLoaders(prevS => {
            return {
              ...prevS,
              [e.args[0].toString()]: txnLoading
            }
          });
        }

        if(e.event === 'LotteryCreated') {
          setReloadList(true);
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
      setEntryBtnLoaders({})
  },[startLError])

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

  
  const showLotteryDetails = async( lotteryId ) => {
    setModalData({
      lotteryId: lotteryId.toString(),
    })
    onOpen()
  }

  const enterLotteryHandler = useCallback(async(lotteryId, ethValue) => {
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
    await callContract({
      args: [lotteryId],
      overrides: {
        value: ethers.utils.parseEther(ethValue.toString())
      }
    });
    await wait();
    setShowEvent(true);
  },[connected]);

  const startLotteryHandler = async () => {
    if(!connected){
      toast({
        title: 'Please Connect to MetaMask',
        status: 'error',
        isClosable: true,
      });
      return;
    }
    await startLottery();
    await swait();
    setShowEvent(true);
  };

  return (
   <>
   {((connected) && (connectedAddr === manager)) && 
    <Flex textAlign={"center"}
        pt={8}
        ml={20}
        justifyContent={"flex-start"}
        direction={"row"}
        >
      <Button colorScheme="blue" isLoading={startLLoading} onClick={startLotteryHandler}>Start Lottery</Button>
    </Flex>
    }
     <Flex
      textAlign={"center"}
      pt={3}
      justifyContent={"center"}
      direction={"column"}
      width={"full"}
      >
        
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
                  <Lottery index={index} key={index} lotteryId={data} enterLotteryHandler={enterLotteryHandler} showLotteryDetails={showLotteryDetails} setModalData={setModalData} entryBtnLoaders={entryBtnLoaders}/>
                ))}
              </SimpleGrid>:

              <Stack direction="row" alignItems="center" justifyContent={'center'} pt="8">
                <Text p="10">No Active Lotteries Currently</Text>
              </Stack>
            }
              
        </>
      
       : <Spinner loading size={40} applyPadding/>}
       <LotteryDetailModal isOpen={isOpen} onClose={onClose} data={modalData}/>
       <ToastMessage message={hasError} toastType="error"/>
    </Flex>
   </>
  );
}
