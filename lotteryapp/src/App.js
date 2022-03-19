import React from "react";

//import Header from "./components/Header";
import NavBar from "./components/NavBar";
import LotteryDashBoard from "./components/LotteryDashBoard";
import useLotteryContract from './hooks/useLotteryContract';

function App() {
  useLotteryContract();

  // const { toggleColorMode } = useColorMode();
  // const bgColor = useColorModeValue("gray.50", "whiteAlpha.50");
  return (
    <>
      <NavBar />
      <LotteryDashBoard/>
    </>
  );
}

export default App;
