import {useEffect} from 'react';
import {
    Box,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Button
  } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import useLotteryContract from "../hooks/useLotteryContract";
import { useMetaMaskAccount } from '../context/AccountContext';
import { checkIfLoading, checkIfError } from '../redux/reducers/selector';
import ToastMessage from './ToastMessage';

  function StatsCard(props) {
    const { title, stat, icon } = props;
    return (
      <Stat
        px={{ base: 2, md: 4 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <Flex justifyContent={'space-between'}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel fontWeight={'bold'} isTruncated>
              {title}
            </StatLabel>
            <StatNumber fontSize={'sm'} fontWeight={'medium'} isTruncated>
              {stat}
            </StatNumber>
          </Box>
        </Flex>
      </Stat>
    );
  }
  
  export default function LotteryStats() {
    const { startLottery, getLotteryManagerAddress, getLotteryAllowedCount } = useLotteryContract();
    const { connectedAddr, connected} = useMetaMaskAccount();
    const {manager, allowedCount}= useSelector(state => state.lottery);
    const loadingState = useSelector(state => state.loading);
    const isLoadingManger = checkIfLoading(loadingState, 'FETCH_LOTTERY_MANAGER')
    const errorFetchingManager = checkIfError(loadingState,'FETCH_LOTTERY_MANAGER');

    const isLoadingAllowedCount = checkIfLoading(loadingState, 'FETCHING_ALLOWED_COUNT')
    const errorFetchingAllowedCount = checkIfError(loadingState,'FETCHING_ALLOWED_COUNT');

    useEffect(() => {
      (async()=>{
          await getLotteryManagerAddress();
      })()
    },[])

    useEffect(() => {
      (async()=>{
          await getLotteryAllowedCount();
      })()
    },[])

    return (
      <>
        {((connected) && (connectedAddr === manager)) && 
          <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
            <Button onClick={startLottery} colorScheme="blue">Start lottery</Button>
          </Box>}
        <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard
              title={'Lottery Manager By'}
              stat={
                (isLoadingManger)?'Loading...':
                  (manager && !errorFetchingManager) && manager
              }
            />
            <StatsCard
              title={'Total Players Allowed Per Lottery'}
              stat={
                (isLoadingAllowedCount)?'Loading...':
                  (allowedCount && !errorFetchingAllowedCount) && allowedCount
              }
            />
          </SimpleGrid>
        </Box>
        <ToastMessage message={errorFetchingManager} toastType="error"/>
      </>
    );
  }