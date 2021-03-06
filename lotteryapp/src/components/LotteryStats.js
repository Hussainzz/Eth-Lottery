import {useEffect} from 'react';
import {
    Box,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue
  } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import useLotteryContract from "../hooks/useLotteryContract";
import { checkIfLoading, checkIfError } from '../redux/reducers/selector';
import ToastMessage from './ToastMessage';

  function StatsCard(props) {
    const { title, stat } = props;
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
    const { getLotteryManagerAddress, getLotteryAllowedCount } = useLotteryContract();
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
        <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard
              title={'Lottery Managed By'}
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
            <StatsCard
              title={'LOTTERY ADDRESS'}
              stat={process.env.REACT_APP_LOTTERY_CONTRACT}
            />
          </SimpleGrid>
        </Box>
        <ToastMessage message={errorFetchingManager} toastType="error"/>
      </>
    );
  }