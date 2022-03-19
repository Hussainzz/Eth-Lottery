const {expect, assert} = require('chai');
const {ethers, getChainId, deployments, companionNetworks} = require('hardhat');
const {config, developmentChains,VERIFICATION_BLOCK_CONFIRMATIONS} = require('../config/chainlink.config')

describe("LotteryGame Unit Tests", () => {
    let LotteryGame;
    let lotteryGame;
    let vrfCoordinatorV2Mock;
    let chainId;
    let deployer;
    let user2;
    let user3;
    before(async () => {
      [deployer, user2, user3] = await ethers.getSigners();
      chainId = await getChainId();
      await deployments.fixture(["main"]);
      vrfCoordinatorV2Mock = await deployments.get("VRFCoordinatorV2Mock")
      vrfCMock = await ethers.getContractAt(
        "VRFCoordinatorV2Mock",
        vrfCoordinatorV2Mock.address
      );

      LotteryGame = await deployments.get("Lottery");
      lotteryGame = await ethers.getContractAt(
        "Lottery",
        LotteryGame.address
      );

      // LotteryGame1 = await deployments.get("Lottery1");
      // lotteryGame1 = await ethers.getContractAt(
      //   "Lottery",
      //   LotteryGame1.address
      // );

    });

    it("Should only allow lotteryManager to start the lottery", async () => {
        await expect(
          lotteryGame.connect(user2).startLottery()
        ).to.be.revertedWith("only_lottery_manager_allowed");
    });

    it("Should Start a New Lottery", async () => {
        await expect(lotteryGame.startLottery()).to.emit(lotteryGame, 'LotteryCreated');
    });

    it("Should allow players to participate in a lottery", async () => {
      //await lotteryGame1.startLottery();
      await expect(lotteryGame.connect(user2).enterLottery(1, {
        value: ethers.utils.parseEther("0.5"),
      })).to.emit(lotteryGame, 'NewLotteryPlayer');
    });

    it("Should reject player from entering lottery with less fee than the lotteryFee", async () => {
        await expect(lotteryGame.connect(user2).enterLottery(1, {
          value: ethers.utils.parseEther("0.4"),
        })).revertedWith("invalid_entry_fee");
    });

    it("Should Pick A Pick A Random Winner", async () => {
      const newLottery = await ethers.getContractAt(
        "Lottery", LotteryGame.address, deployer
      );
      await newLottery.startLottery();
      await newLottery.connect(user2).enterLottery(1, {
        value: ethers.utils.parseEther("0.5"),
      });
      await newLottery.connect(user3).enterLottery(1, {
        value: ethers.utils.parseEther("0.5"),
      });

      await expect(newLottery.pickWinner(1))
      .to.emit(newLottery, "RandomnessRequested")

      const requestId = await newLottery.s_requestId()

       // simulate callback from the oracle network
       await expect(
        vrfCMock.fulfillRandomWords(requestId, newLottery.address)
      ).to.emit(newLottery, "WinnerDeclared")
    });

    it("Should pick a winner and transfer the lottery pricePool",  async () => {
      await lotteryGame.startLottery();
      await lotteryGame.connect(user2).enterLottery(2, {
        value: ethers.utils.parseEther("1"),
      });
      await expect(await lotteryGame.pickWinner(2)).to.changeEtherBalance(
        user2,
        ethers.utils.parseEther("1")
      );
    });
  });