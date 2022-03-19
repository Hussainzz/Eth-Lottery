const config = {
    // Hardhat local network
    // Mock Data (it won't work)
    31337: {
      name: "hardhat",
      keyHash:
        "0x7c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f3",
      fee: "0.1",
      fundAmount: "10000000000000000000",
    },
    //ganache
    1337: {
      name: "ganache",
      keyHash:
        "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
      fee: "0.1",
      fundAmount: "10000000000000000000",
    },
    // Rinkeby
    4: {
      name: "rinkeby",
      linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
      vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
      keyHash:
        "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
      fee: "0.25",
      fundAmount: "2000000000000000000",
    },
  };
  const autoFundCheck = async (
    contractAddr,
    networkName,
    linkTokenAddress,
    additionalMessage
  ) => {
    const chainId = await getChainId();
    console.log("Checking to see if contract can be auto-funded with LINK:");
    const amount = config[chainId].fundAmount;
    // check to see if user has enough LINK
    const accounts = await ethers.getSigners();
    const signer = accounts[0];
    const LinkToken = await ethers.getContractFactory("LinkToken");
    const linkTokenContract = new ethers.Contract(
      linkTokenAddress,
      LinkToken.interface,
      signer
    );
    const balanceHex = await linkTokenContract.balanceOf(signer.address);
    const balance = await ethers.BigNumber.from(balanceHex._hex).toString();
    const contractBalanceHex = await linkTokenContract.balanceOf(contractAddr);
    const contractBalance = await ethers.BigNumber.from(
      contractBalanceHex._hex
    ).toString();
    if (balance > amount && amount > 0 && contractBalance < amount) {
      // user has enough LINK to auto-fund
      // and the contract isn't already funded
      return true;
    } else {
      // user doesn't have enough LINK, print a warning
      console.log(
        "Account doesn't have enough LINK to fund contracts, or you're deploying to a network where auto funding isnt' done by default"
      );
      console.log(
        "Please obtain LINK via the faucet at https://" +
          networkName +
          ".chain.link/, then run the following command to fund contract with LINK:"
      );
      console.log(
        "npx hardhat fund-link --contract " +
          contractAddr +
          " --network " +
          networkName +
          additionalMessage
      );
      return false;
    }
  };

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
  
  module.exports = {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    config,
    autoFundCheck,
  };