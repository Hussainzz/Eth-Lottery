import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import Icon from "@chakra-ui/icon";
import { DiCodeigniter, DiAndroid, DiWebplatform } from "react-icons/di";
import {FaEthereum} from "react-icons/fa";

const LotteryListing = () => {
  return (
    <Flex
      direction={"row"}
      w="100%"
      maxWidth={{ base: "100vh", md: "130vh", lg: "130vh", xl: "130vh" }}
    >
      <Box alignSelf="center" px="32" py="16">
        <Text fontWeight="bold" fontSize="2xl">
          All Active Lotteries
        </Text>
        <Flex direction={"row"} mt={8}>
          <Flex
            rounded="sm"
            mt={4}
            bg="gray.200"
            h="15vh"
            w="40vh"
            justify="flex-left"
          >
            <Text color="black" p="4" fontSize="xl" fontWeight="semibold">
              eth-lottery: ID - 1
            </Text>
            <Icon color="black" p="4" as={FaEthereum} w="24" h="24" />

          </Flex>
          <Flex
            rounded="xl"
            direction="column"
            mt={4}
            ml={4}
            bg="gray.100"
            h="30vh"
            w="30vh"
            justify="flex-end"
            _hover={{ bg: "teal.400" }}
          >
            <Icon color="black" p="4" as={DiCodeigniter} w="24" h="24" />
            <Text color="black" p="4" fontSize="xl" fontWeight="semibold">
              Flutter Apps
            </Text>
          </Flex>
          <Flex
            rounded="xl"
            direction="column"
            mt={4}
            ml={4}
            bg="gray.100"
            h="30vh"
            w="30vh"
            justify="flex-end"
            _hover={{ bg: "green.400" }}
          >
            <Icon as={DiWebplatform} p="4" w="24" h="24" color="black" />
            <Text color="black" p="4" fontSize="xl" fontWeight="semibold">
              Web Apps
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default LotteryListing;
