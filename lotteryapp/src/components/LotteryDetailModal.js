import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    List,
    ListItem
  } from '@chakra-ui/react'
const LotteryDetailModal = ({isOpen, onClose, data}) => {

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eth-Lottery ID: {data.lotteryId}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <List spacing={2}>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Ticket Price:
                  </Text>{' '}
                  0.5 ether
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Active Players:
                  </Text>{' '}
                  5
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Current Price Pool:
                  </Text>{' '}
                  10 ether
                </ListItem>
                </List>
          </ModalBody>

          <ModalFooter>
            <Button size={'sm'} colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LotteryDetailModal