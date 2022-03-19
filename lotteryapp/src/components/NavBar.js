import React,{useEffect} from "react";
import {
  Box,
  Flex,
  VStack,
  Button,
  Badge,
  Heading,
  useColorMode,
  useColorModeValue,
  Image,
  Spacer,
  useToast
} from "@chakra-ui/react";
//import { IconButton } from "@chakra-ui/button";
//import { FaSun, FaMoon, FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa'
//import logo from "../ethLot.png";
import { useMetaMaskAccount } from "../context/AccountContext";

const NavBar = () => {
  const toast = useToast();
  const { connectedAddr, connected, connectToMetaMask, disconnect, loading, netWorkName, accountErrorMessage } =
    useMetaMaskAccount();


  useEffect(() => {
    if(accountErrorMessage !== ""){
      toast({
        title: accountErrorMessage,
        position: 'bottom-right',
        isClosable: true,
      })
    }
  },[toast, accountErrorMessage]);

  return (
    <VStack p={3}>
      <Flex w="100%">
       {/*  <Box w="100%" p={4} color="white"> */}
          {/* <Image src={logo} htmlWidth="150px" /> */}
        {/* </Box> */}
        <Heading
          ml="8" size="md" fontWeight='bold' color="cyan.400">Eth-Lottery</Heading>
        <Spacer />
        <Box p={5}>
          <Badge colorScheme="green">{connectedAddr}</Badge>
        </Box>
        <Box p={3} color="white">
          {!connected ? (
            <Button
              size="sm"
              colorScheme="blue"
              onClick={connectToMetaMask}
              isLoading={loading}
            >
              Connect to MetaMask
            </Button>
          ) : (
            <Button
              size="sm"
              colorScheme="red"
              onClick={disconnect}
              isLoading={loading}
            >
              {(netWorkName !== "") && (netWorkName)} Disconnect
            </Button>
          )}
        </Box>
      </Flex>
    </VStack>
  );
};

export default NavBar;
