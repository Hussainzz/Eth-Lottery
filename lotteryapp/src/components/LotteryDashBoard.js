import React from "react";
import { useSelector } from "react-redux";
import LotteryListing from "./LotteryListing";
import LotteryStats from "./LotteryStats";

const LotteryDashBoard = () => {
  return (
    <>
        <LotteryStats/>
        <LotteryListing />
    </>
  );
};

export default LotteryDashBoard;
