import {useEffect, useState} from 'react';
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
  useDisclosure
} from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import { useSelector } from "react-redux";
import useLotteryContract from "../hooks/useLotteryContract";
import Spinner from "./Spinner";
import LotteryDetailModal from './LotteryDetailModal';

const backgrounds = [
  `url("data:image/svg+xml, %3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'560\' height=\'185\' viewBox=\'0 0 560 185\' fill=\'none\'%3E%3Cellipse cx=\'102.633\' cy=\'61.0737\' rx=\'102.633\' ry=\'61.0737\' fill=\'%23ED64A6\' /%3E%3Cellipse cx=\'399.573\' cy=\'123.926\' rx=\'102.633\' ry=\'61.0737\' fill=\'%23F56565\' /%3E%3Cellipse cx=\'366.192\' cy=\'73.2292\' rx=\'193.808\' ry=\'73.2292\' fill=\'%2338B2AC\' /%3E%3Cellipse cx=\'222.705\' cy=\'110.585\' rx=\'193.808\' ry=\'73.2292\' fill=\'%23ED8936\' /%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ED8936'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%2348BB78'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%230BC5EA'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED8936'/%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%2348BB78'/%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%230BC5EA'/%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ECC94B'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%239F7AEA'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%234299E1'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%2348BB78'/%3E%3C/svg%3E")`,
];

function Lottery(props) {
  const { index, lotteryId, enterLottery, showLotteryDetails } = props;
  const [entryFee, setEntryFee] = useState('');

  const enterLotteryHandler = async() =>{
    if(entryFee === "") return;
    await enterLottery(lotteryId,entryFee)
  }

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
            onClick={enterLotteryHandler}
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalData, setModalData] = useState({});
  const { getLotteryIds, enterLottery } = useLotteryContract();
  const {loading, allLotteryIds} = useSelector(state => state.lottery)

  useEffect(() => {
      (async () => {
        await getLotteryIds();
      })()
  },[])

  const showLotteryDetails = async( lotteryId ) => {
    setModalData({
      lotteryId: lotteryId.toString(),
    })
    onOpen()
  }

  return (
    <Flex
      textAlign={"center"}
      pt={3}
      justifyContent={"center"}
      direction={"column"}
      width={"full"}
    >
       { (!loading) ?
      <SimpleGrid
        p={4}
        columns={{ base: 1, xl: 3 }}
        spacing={"8"}
        mt={16}
        ml={4}
      >
      
        {allLotteryIds.map((data, index) =>(
          <Lottery index={index} key={index} lotteryId={data} enterLottery={enterLottery} showLotteryDetails={showLotteryDetails} setModalData={setModalData}/>
        ))}
       
      </SimpleGrid>
       : <Spinner loading size={40}/>}
       <LotteryDetailModal isOpen={isOpen} onClose={onClose} data={modalData}/>
    </Flex>
  );
}
