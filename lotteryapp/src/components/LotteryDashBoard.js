import { VStack,Flex } from '@chakra-ui/react';
import React from 'react'
import useLotteryContract from '../hooks/useLotteryContract';
import LotteryListing from './LotteryListing';

const LotteryDashBoard = () => {
  const {allLotteryIds, fetchingLotteryIds} = useLotteryContract();

  return (
      
      <LotteryListing/>
  )
}

export default LotteryDashBoard