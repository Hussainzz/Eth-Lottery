import React from 'react'
import {
    Heading,
    Box,
    Badge,
    Text,
    Stack,
    Button,
    useColorModeValue,
    Input
  } from '@chakra-ui/react';

const LotteryCard = () => {
  return (
<Box
        maxW={'270px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        borderWidth="2px"
        shadow="lg"
        rounded={'md'}
        overflow={'hidden'}>
        
        <Box p={6}>
          <Stack spacing={0} align={'left'} mb={5}>
            <Heading fontSize={'1xl'} fontWeight={300} fontFamily={'body'}>
              Eth-Lottery 
            </Heading>
            <Text color={'gray.500'}> 
              <Badge variant='solid' colorScheme='green'>
                ID: 1
              </Badge>
            </Text>
          </Stack>

          <Stack direction={'row'} justify={'center'} spacing={6} pb="8px">
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>2 / 5</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Active Players
              </Text>
            </Stack>
          </Stack>
          
          <Input placeholder='Enter Eth' size='sm' />

          <Button
            size='sm'
            w={'full'}
            mt={3}
            bg={useColorModeValue('#3182ce', 'gray.900')}
            color={'white'}
            rounded={'md'}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}>
            Enter Lottery
          </Button>
        </Box>
      </Box>
  )
}

export default LotteryCard