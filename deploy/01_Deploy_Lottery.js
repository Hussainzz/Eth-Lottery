const { config,developmentChains,VERIFICATION_BLOCK_CONFIRMATIONS } = require("../config/chainlink.config");
const { network } = require("hardhat")
module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  ethers,
}) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  let linkToken;
  let linkTokenAddress;
  let vrfCoordinatorAddress;
  let subscriptionId
  
  if (chainId == 31337 || chainId == 1337) {
    linkToken = await get("LinkToken");
    //log(ethers)
    VRFCoordinatorV2Mock = await get("VRFCoordinatorV2Mock")
    linkTokenAddress = linkToken.address;
    vrfCoordinatorAddress = VRFCoordinatorV2Mock.address;
    const vrfM = await ethers.getContractAt(
      "VRFCoordinatorV2Mock", vrfCoordinatorAddress, await ethers.getSigner()
    );
    const fundAmount = config[chainId]["fundAmount"]
    const transaction = await vrfM.createSubscription()
    const transactionReceipt = await transaction.wait(1)
    subscriptionId = ethers.BigNumber.from(transactionReceipt.events[0].topics[1])
    await vrfM.fundSubscription(subscriptionId, fundAmount)

  } else {
    subscriptionId = process.env.VRF_SUBSCRIPTION_ID
    linkTokenAddress = config[chainId]["linkToken"]
    vrfCoordinatorAddress = config[chainId]["vrfCoordinator"]
  }

  const keyHash = config[chainId].keyHash;
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const lotteryData = await deploy("LotteryData",{
    from:deployer,
    log: true
  });

  const lottery = await deploy("Lottery", {
    from: deployer,
    args: [
      keyHash,
      subscriptionId, 
      vrfCoordinatorAddress, 
      linkTokenAddress,
      lotteryData.address
    ],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  const lData = await ethers.getContractAt(
    "LotteryData", lotteryData.address, await ethers.getSigner()
  );
  await lData.updateLotteryContract(lottery.address);

  //lottery 2
  // const lotteryData1 = await deploy("LotteryData1",{
  //   from:deployer,
  //   log: true,
  //   contract: "LotteryData"
  // });

  // const lottery1 = await deploy("Lottery1", {
  //   from: deployer,
  //   args: [
  //     keyHash,
  //     subscriptionId, 
  //     vrfCoordinatorAddress, 
  //     linkTokenAddress,
  //     lotteryData1.address
  //   ],
  //   log: true,
  //   waitConfirmations: waitBlockConfirmations,
  //   contract: "Lottery"
  // });

  // const lData1 = await ethers.getContractAt(
  //   "LotteryData", lotteryData1.address, await ethers.getSigner()
  // );
  // await lData1.updateLotteryContract(lottery1.address);

  log("----------------------------------------------------");
  log("VRF subscriptionId  " +  subscriptionId);
  log("Lottery Data Deployed On " +  lotteryData.address + " network " + network.name);
  log("Lottery Deployed On " +  lottery.address + " network " + network.name);
  log("----------------------------------------------------");

  // log("----------------------------------------------------");
  // log("Lottery Data1 Deployed On " +  lotteryData1.address);
  // log("Lottery1 Deployed On " +  lottery1.address);
  // log("----------------------------------------------------");

};

module.exports.tags = ["all", "main"];
