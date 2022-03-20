import React,{useEffect} from 'react'
import {useToast} from "@chakra-ui/react";
const ToastMessage = ({message, toastType}) => {
  const toast = useToast();
  
  useEffect(() => {
    (async () => {
      if(message != null){
        toast({
          title: message,
          status: toastType,
          isClosable: true,
        });
      }
    })()
  },[message, toast]);
  return (
    <></>
  )
}
export default ToastMessage